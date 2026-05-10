import { useState } from "react";
import Card from "../../components/ui/Card";

export default function NotesPanel() {
  const [notes, setNotes] = useState("");

  return (
    <Card>
      <h2 className="font-semibold mb-4">Consultation Notes</h2>

      <textarea
        className="w-full border rounded-lg p-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write symptoms, diagnosis, advice..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {notes && (
        <p className="text-xs text-gray-500 mt-2">
          {notes.length} characters
        </p>
      )}
    </Card>
  );
}