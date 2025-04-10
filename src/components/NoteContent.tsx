
import { Note } from "../types";
import NoteActions from "./NoteActions";
import { editNote, deleteNote } from "../utils/storage";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface NoteContentProps {
  notes: Note[];
  groupName: string | null;
  onNoteEdited: (noteId: string, content: string) => void;
  onNoteDeleted: (noteId: string) => void;
}

const NoteContent = ({ notes, groupName, onNoteEdited, onNoteDeleted }: NoteContentProps) => {
  const { toast } = useToast();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

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

  // Handle note edit
  const handleNoteEdit = (noteId: string, content: string) => {
    const success = editNote(noteId, content);
    if (success) {
      onNoteEdited(noteId, content);
      setSelectedNoteId(null); // Deselect note after editing
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    }
  };

  // Handle note deletion
  const handleNoteDelete = (noteId: string) => {
    const success = deleteNote(noteId);
    if (success) {
      onNoteDeleted(noteId);
      setSelectedNoteId(null); // Reset selection after deletion
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    }
  };

  // If no group is selected
  if (!groupName) {
    return (
      <div className="notes-content">
        <div className="notes-welcome">
          <div className="notes-welcome-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.7886 58.7629C26.2766 58.7629 25.8581 58.6694 25.5331 58.4824C25.2081 58.2955 24.9457 58.0955 24.7457 57.8825C24.5457 57.6694 24.3866 57.4694 24.2685 57.2824C24.1505 57.0955 24.0497 56.939 23.9662 56.813L23.8831 56.688H47.0982C47.0982 56.688 47.2428 56.6133 47.532 56.4639C47.8212 56.3145 48.1173 56.0486 48.4204 55.666C48.7234 55.2835 48.975 54.804 49.175 54.2275C49.375 53.651 49.475 52.9981 49.475 52.2687V29.6334L26.7886 58.7629Z" fill="#F4B557"/>
              <path d="M16.1709 22.3175C13.7211 22.3175 11.7962 21.7645 10.3963 20.6585C8.99635 19.5525 8.29639 18.0935 8.29639 16.2815C8.29639 14.6015 8.94637 13.2175 10.2463 12.1295C11.5463 11.0415 13.2961 10.4975 15.4959 10.4975C17.6957 10.4975 19.4455 11.0415 20.7455 12.1295C22.0454 13.2175 22.6954 14.6015 22.6954 16.2815C22.6954 18.1115 22.0204 19.5705 20.6704 20.6585C19.3205 21.7645 17.4956 22.3175 16.1709 22.3175Z" fill="#007A5A"/>
              <path d="M40.2975 34.0895C37.8477 34.0895 35.9228 33.5365 34.5229 32.4305C33.1229 31.3245 32.423 29.8655 32.423 28.0535C32.423 26.3735 33.073 24.9895 34.3729 23.9015C35.6728 22.8135 37.4227 22.2695 39.6225 22.2695C41.8223 22.2695 43.5721 22.8135 44.872 23.9015C46.172 25.0075 46.8219 26.3915 46.8219 28.0535C46.8219 29.8835 46.1469 31.3425 44.797 32.4305C43.4471 33.5365 41.6222 34.0895 40.2975 34.0895Z" fill="#F4B557"/>
              <path d="M64.1941 22.3175C61.7442 22.3175 59.8194 21.7645 58.4194 20.6585C57.0195 19.5525 56.3195 18.0935 56.3195 16.2815C56.3195 14.6015 56.9695 13.2175 58.2694 12.1295C59.5694 11.0415 61.3192 10.4975 63.519 10.4975C65.7188 10.4975 67.4686 11.0415 68.7686 12.1295C70.0685 13.2175 70.7185 14.6015 70.7185 16.2815C70.7185 18.1115 70.0435 19.5705 68.6935 20.6585C67.3436 21.7645 65.5187 22.3175 64.1941 22.3175Z" fill="#DE5246"/>
              <path d="M16.1709 45.6275C13.7211 45.6275 11.7962 45.0745 10.3963 43.9685C8.99635 42.8625 8.29639 41.4035 8.29639 39.5915C8.29639 37.9115 8.94637 36.5275 10.2463 35.4395C11.5463 34.3515 13.2961 33.8075 15.4959 33.8075C17.6957 33.8075 19.4455 34.3515 20.7455 35.4395C22.0454 36.5455 22.6954 37.9295 22.6954 39.5915C22.6954 41.4215 22.0204 42.8805 20.6704 43.9685C19.3205 45.0745 17.4956 45.6275 16.1709 45.6275Z" fill="#227FE8"/>
              <path d="M64.1941 45.6275C61.7442 45.6275 59.8194 45.0745 58.4194 43.9685C57.0195 42.8625 56.3195 41.4035 56.3195 39.5915C56.3195 37.9115 56.9695 36.5275 58.2694 35.4395C59.5694 34.3515 61.3192 33.8075 63.519 33.8075C65.7188 33.8075 67.4686 34.3515 68.7686 35.4395C70.0685 36.5275 70.7185 37.9115 70.7185 39.5915C70.7185 41.4215 70.0435 42.8805 68.6935 43.9685C67.3436 45.0745 65.5187 45.6275 64.1941 45.6275Z" fill="#443DF6"/>
              <path d="M40.2975 57.6475C37.8477 57.6475 35.9228 57.0945 34.5229 55.9885C33.1229 54.8825 32.423 53.4235 32.423 51.6115C32.423 49.9315 33.073 48.5475 34.3729 47.4595C35.6728 46.3715 37.4227 45.8275 39.6225 45.8275C41.8223 45.8275 43.5721 46.3715 44.872 47.4595C46.172 48.5475 46.8219 49.9315 46.8219 51.6115C46.8219 53.4415 46.1469 54.9005 44.797 55.9885C43.4471 57.0945 41.6222 57.6475 40.2975 57.6475Z" fill="#C73E00"/>
            </svg>
          </div>
          <h2 className="notes-welcome-title">Pocket Notes</h2>
          <p className="notes-welcome-text">
            Send and receive messages without keeping your phone online.<br />
            Use Pocket Notes on up to 4 linked devices and 1 mobile phone
          </p>
          <p className="notes-welcome-encryption">
            <span className="lock-icon">🔒</span> End-to-end encrypted
          </p>
        </div>
      </div>
    );
  }

  // Render notes or empty state
  return (
    <div className="notes-content">
      <div className="notes-group-header">
        <div className="notes-group-header-content">
          {groupName && (
            <>
              <div 
                className="notes-group-avatar" 
                style={{ 
                  backgroundColor: notes.length > 0 
                    ? notes[0].groupColor || '#888'
                    : '#888' 
                }}
              >
                {groupName.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="notes-group-title">{groupName}</h2>
            </>
          )}
        </div>
      </div>
      <div className="notes-list">
        {notes.length === 0 ? (
          <div className="notes-empty-state">
            <p>No notes in this group yet.</p>
            <p>Add your first note below!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div 
              key={note.id} 
              className={`notes-item ${selectedNoteId === note.id ? 'notes-item-selected' : ''}`}
              onClick={() => setSelectedNoteId(selectedNoteId === note.id ? null : note.id)}
            >
              <div className="notes-item-content">{note.content}</div>
              <div className="notes-item-footer">
                <div className="notes-item-date">{formatDate(note.updatedAt)}</div>
                {/* Always show actions for better discoverability, but highlight when selected */}
                <NoteActions
                  note={note}
                  onEdit={handleNoteEdit}
                  onDelete={handleNoteDelete}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteContent;
