
import { useState, useEffect } from "react";
import GroupList from "./GroupList";
import GroupModal from "./GroupModal";
import NoteContent from "./NoteContent";
import NoteInput from "./NoteInput";
import { Group, Note } from "../types";
import { getGroups, getGroupNotes } from "../utils/storage";

const NoteApp = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);

  // Get active group name
  const activeGroupName = activeGroupId 
    ? groups.find(g => g.id === activeGroupId)?.name || null
    : null;

  // Load groups from storage on mount
  useEffect(() => {
    const storedGroups = getGroups();
    setGroups(storedGroups);
    
    // If we have groups, select the first one
    if (storedGroups.length > 0 && !activeGroupId) {
      setActiveGroupId(storedGroups[0].id);
    }
  }, []);

  // Load notes when active group changes
  useEffect(() => {
    if (activeGroupId) {
      const groupNotes = getGroupNotes(activeGroupId);
      // Sort notes by updatedAt in descending order (newest first)
      const sortedNotes = [...groupNotes].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setNotes(sortedNotes);
    } else {
      setNotes([]);
    }
  }, [activeGroupId]);

  // Handle group selection
  const handleGroupSelect = (groupId: string) => {
    setActiveGroupId(groupId);
  };

  // Handle new group added
  const handleGroupAdded = (group: Group) => {
    setGroups([...groups, group]);
    setActiveGroupId(group.id);
  };

  // Handle new note added
  const handleNoteAdded = (note: Note) => {
    setNotes([note, ...notes]);
  };

  return (
    <div className="notes-app">
      <GroupList
        groups={groups}
        activeGroupId={activeGroupId}
        onGroupSelect={handleGroupSelect}
        onCreateGroup={() => setShowGroupModal(true)}
      />
      
      <div className="notes-main">
        <NoteContent 
          notes={notes} 
          groupName={activeGroupName} 
        />
        <NoteInput 
          groupId={activeGroupId} 
          onNoteAdded={handleNoteAdded} 
        />
      </div>
      
      <GroupModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        onGroupAdded={handleGroupAdded}
      />
    </div>
  );
};

export default NoteApp;
