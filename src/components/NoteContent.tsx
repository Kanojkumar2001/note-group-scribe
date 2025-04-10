
import { Note } from "../types";

interface NoteContentProps {
  notes: Note[];
  groupName: string | null;
}

const NoteContent = ({ notes, groupName }: NoteContentProps) => {
  // Format date to a readable string
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    
    // Format time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    // Format date
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const dateStr = `${day} ${month} ${year}`;
    
    return `${timeString}, ${dateStr}`;
  };

  // If no group is selected
  if (!groupName) {
    return (
      <div className="notes-content">
        <div className="notes-empty-state">
          <div className="notes-empty-icon">📝</div>
          <h2>Pocket Notes</h2>
          <p>Send and receive messages without keeping your phone online.<br />
             Use Pocket Notes on up to 4 linked devices and 1 mobile phone</p>
        </div>
      </div>
    );
  }

  // Render notes or empty state
  return (
    <div className="notes-content">
      {notes.length === 0 ? (
        <div className="notes-empty-state">
          <p>No notes in this group yet. Add your first note below!</p>
        </div>
      ) : (
        notes.map((note) => (
          <div key={note.id} className="notes-item">
            <div className="notes-item-content">{note.content}</div>
            <div className="notes-item-date">{formatDate(note.updatedAt)}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default NoteContent;
