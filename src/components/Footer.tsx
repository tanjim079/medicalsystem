// components/Footer.tsx

import { Mail, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0f172a] text-gray-300 mt-10">
            <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

                {/* Contact */}
                <div>
                    <h2 className="text-white text-lg font-semibold mb-4">
                        Contact RUET
                    </h2>
                    <p>
                        Registrar, Rajshahi University of Engineering & Technology <br />
                        Kazla, Rajshahi-6204, Bangladesh.
                    </p>

                    <div className="mt-4 space-y-2">
                        <p className="flex items-center gap-2">
                            <Phone size={16} /> +88-025888-67105
                        </p>
                        <p className="flex items-center gap-2">
                            <Phone size={16} /> +88-025888-66798
                        </p>
                        <p className="flex items-center gap-2">
                            <Mail size={16} /> adsw@ruet.ac.bd
                        </p>
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h2 className="text-white text-lg font-semibold mb-4">
                        Important Links
                    </h2>

                    <div className="grid grid-cols-2 gap-2">
                        <a href="#" className="hover:text-white">RUET Main</a>
                        <a href="#" className="hover:text-white">NOC</a>
                        <a href="#" className="hover:text-white">Career at RUET</a>
                        <a href="#" className="hover:text-white">Tender</a>
                        <a href="#" className="hover:text-white">Campus Life</a>
                        <a href="#" className="hover:text-white">MoU</a>
                        <a href="#" className="hover:text-white">News</a>
                        <a href="#" className="hover:text-white">UGC</a>
                    </div>
                </div>

                {/* Map */}
                <div>
                    <iframe
                        title="RUET Map"
                        src="https://www.google.com/maps?q=Rajshahi%20University%20of%20Engineering%20and%20Technology&output=embed"
                        className="w-full h-40 rounded-md border-0"
                        loading="lazy"
                    />
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-700 text-center py-4 text-sm">
                Copyright © RUET 2026
            </div>
        </footer>
    );
}