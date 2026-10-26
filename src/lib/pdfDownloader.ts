import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface DownloadPdfOptions {
  /** The DOM element to capture */
  element: HTMLElement;
  /** Downloaded filename, e.g. "report-123.pdf" */
  filename: string;
  /** Desired virtual document width in pixels (default: 800 for standard A4) */
  targetWidth?: number;
}

/**
 * Downloads a DOM element as a crisp, full-width A4 PDF on all devices,
 * preventing mobile viewport clipping, scroll offsets, and page cutoffs.
 */
export async function downloadElementAsPdf({
  element,
  filename,
  targetWidth = 800,
}: DownloadPdfOptions): Promise<void> {
  // 1. Render element into an HTML canvas using html2canvas with desktop windowWidth
  const canvas = await html2canvas(element, {
    scale: 2, // 2x resolution for sharp text & vector-quality logos
    useCORS: true,
    allowTaint: true,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: 1024, // Evaluates responsive media queries as desktop
    onclone: (clonedDoc, clonedElement) => {
      // Force cloned element to render with standard document width regardless of mobile screen size
      clonedElement.style.width = `${targetWidth}px`;
      clonedElement.style.minWidth = `${targetWidth}px`;
      clonedElement.style.maxWidth = `${targetWidth}px`;
      clonedElement.style.height = "auto";
      clonedElement.style.minHeight = "auto";
      clonedElement.style.margin = "0 auto";
      clonedElement.style.boxSizing = "border-box";
      clonedElement.style.overflow = "visible";
      clonedElement.style.transform = "none";
      clonedElement.style.position = "relative";

      // Ensure all ancestor containers do not restrict width or clip content
      let curr: HTMLElement | null = clonedElement.parentElement;
      while (curr && curr !== clonedDoc.body) {
        curr.style.width = "auto";
        curr.style.minWidth = "0";
        curr.style.maxWidth = "none";
        curr.style.overflow = "visible";
        curr.style.height = "auto";
        curr = curr.parentElement;
      }

      // Ensure any nested tables expand to full width
      const tables = clonedElement.querySelectorAll("table");
      tables.forEach((t) => {
        (t as HTMLElement).style.width = "100%";
        (t as HTMLElement).style.maxWidth = "none";
      });
    },
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm

  // Maintain clean 5mm margins on sides
  const marginX = 5;
  const contentWidth = pageWidth - marginX * 2; // 200 mm
  const totalPdfHeight = (canvas.height * contentWidth) / canvas.width;

  // Single-page vs Multi-page handling:
  // If the content height is within ~15% of a single A4 page, scale it down slightly
  // so single-page medical documents (prescriptions/reports) fit cleanly on 1 sheet.
  if (totalPdfHeight <= pageHeight * 1.15) {
    const scale = totalPdfHeight > pageHeight - 10 ? (pageHeight - 10) / totalPdfHeight : 1;
    const finalWidth = contentWidth * scale;
    const finalHeight = totalPdfHeight * scale;
    const finalMarginX = (pageWidth - finalWidth) / 2;
    const finalMarginY = Math.max(5, (pageHeight - finalHeight) / 2);

    pdf.addImage(imgData, "PNG", finalMarginX, finalMarginY, finalWidth, finalHeight, undefined, "FAST");
  } else {
    // Multi-page document: Paginate seamlessly across pages so no content is ever cut off
    let heightLeft = totalPdfHeight;
    let position = 0; // vertical offset in mm

    // Page 1
    pdf.addImage(imgData, "PNG", marginX, position, contentWidth, totalPdfHeight, undefined, "FAST");
    heightLeft -= pageHeight;

    // Subsequent pages
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", marginX, position, contentWidth, totalPdfHeight, undefined, "FAST");
      heightLeft -= pageHeight;
    }
  }

  pdf.save(filename);
}
