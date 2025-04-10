
import { useState, useRef, useEffect } from "react";
import { Group } from "../types";
import { addGroup, generateId, getRandomColor } from "../utils/storage";

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupAdded: (group: Group) => void;
}

const GroupModal = ({ isOpen, onClose, onGroupAdded }: GroupModalProps) => {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
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
      color: getRandomColor(),
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
        <div className="notes-modal-title">Create New Group</div>
        
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
