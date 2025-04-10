
import { useState, useRef, useEffect } from "react";
import { Note } from "../types";
import { addNote, generateId } from "../utils/storage";

interface NoteInputProps {
  groupId: string | null;
  groupColor?: string;
  onNoteAdded: (note: Note) => void;
}

const NoteInput = ({ groupId, groupColor, onNoteAdded }: NoteInputProps) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "60px"; // Reset height
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [content]);

  // Submit the note
  const handleSubmit = () => {
    if (!groupId || !content.trim()) return;

    const now = new Date().toISOString();
    const newNote: Note = {
      id: generateId(),
      content: content.trim(),
      groupId,
      groupColor: groupColor, // Store the group color with the note
      createdAt: now,
      updatedAt: now,
    };

    // Save to storage and update UI
    addNote(newNote);
    onNoteAdded(newNote);
    setContent("");

    // Focus back on textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Handle keydown events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Don't render if no group is selected
  if (!groupId) return null;

  return (
    <div className="notes-input-container">
      <textarea
        ref={textareaRef}
        className="notes-input"
        placeholder="Enter your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="notes-submit-btn"
        onClick={handleSubmit}
        disabled={!content.trim()}
        aria-label="Send note"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ color: content.trim() ? 'hsl(var(--notes-accent))' : 'hsl(var(--notes-light-text))' }}
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  );
};

export default NoteInput;
