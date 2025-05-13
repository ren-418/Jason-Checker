import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

export default function NotesSection({ userEmail, eventId, notesDocument }) {
  const [note, setNote] = useState(notesDocument[eventId] ?? "");

  const handleSaveNote = async () => {
    try {
      const eventNotesCollectionRef = doc(db, "eventNotes2", userEmail);
      await setDoc(eventNotesCollectionRef, { notes: { [eventId]: note } }, { merge: true });
    } catch (error) {
      console.error("Error saving note: ", error);
    }
  };

  return (
    <div className="relative">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={handleSaveNote}
        placeholder="Notes"
        className="bg-[#C5C5C5] dark:bg-[rgba(21,21,21,1)] w-full h-[251px] placeholder:text-center placeholder:font-semibold outline-none resize-none px-4 py-6 placeholder:text-[#333333] dark:placeholder:text-white text-[#333333] dark:text-white border-2 border-[rgb(103,0,4)] rounded-xl"
      />
    </div>
  );
}