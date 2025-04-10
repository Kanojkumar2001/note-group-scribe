
import { useState, useRef, useEffect } from "react";
import { Group } from "../types";
import { addGroup, generateId } from "../utils/storage";

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupAdded: (group: Group) => void;
}

// Predefined colors for group avatars
const GROUP_COLORS = [
  "#0369A1", // Blue
  "#15803D", // Green
  "#B91C1C", // Red
  "#7E22CE", // Purple
  "#C2410C", // Orange
  "#4338CA", // Indigo
  "#BE185D", // Pink
  "#B45309", // Amber
];

const GroupModal = ({ isOpen, onClose, onGroupAdded }: GroupModalProps) => {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState(GROUP_COLORS[0]);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      // Select a random color when opening modal
      setSelectedColor(GROUP_COLORS[Math.floor(Math.random() * GROUP_COLORS.length)]);
    }
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setGroupName("");
      setError("");
    }
  }, [isOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = () => {
    // Basic validation
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    if (groupName.trim().length < 2) {
      setError("Group name must be at least 2 characters");
      return;
    }

    // Create new group
    const newGroup: Group = {
      id: generateId(),
      name: groupName.trim(),
      color: selectedColor,
    };

    // Try to add the group (returns false if duplicate)
    const added = addGroup(newGroup);
    if (!added) {
      setError("A group with this name already exists");
      return;
    }

    // Reset form and close modal
    onGroupAdded(newGroup);
    setGroupName("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="notes-modal-overlay">
      <div className="notes-modal" ref={modalRef}>
        <div className="notes-modal-title">Create New Notes Group</div>
        
        {error && <div className="notes-modal-error">{error}</div>}
        
        <input
          type="text"
          className="notes-modal-input"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            } else if (e.key === "Escape") {
              onClose();
            }
          }}
        />
        
        <div className="notes-modal-color-picker">
          <p className="notes-modal-color-label">Choose color</p>
          <div className="notes-modal-color-options">
            {GROUP_COLORS.map((color) => (
              <div
                key={color}
                className={`notes-modal-color-option ${selectedColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="notes-modal-actions">
          <button 
            className="notes-modal-btn cancel" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="notes-modal-btn create" 
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;
