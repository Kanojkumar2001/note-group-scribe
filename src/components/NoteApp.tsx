
import { useState, useEffect } from "react";
import GroupList from "./GroupList";
import GroupModal from "./GroupModal";
import NoteContent from "./NoteContent";
import NoteInput from "./NoteInput";
import { Group, Note } from "../types";
import { getGroups, getGroupNotes, deleteGroup } from "../utils/storage";
import { Toaster } from "./ui/toaster";
import { toast } from "@/hooks/use-toast";

const NoteApp = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Get active group details
  const activeGroup = activeGroupId 
    ? groups.find(g => g.id === activeGroupId)
    : null;
  
  const activeGroupName = activeGroup?.name || null;
  const activeGroupColor = activeGroup?.color || null;

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
      setShowSidebar(!isMobile || !activeGroupId);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [activeGroupId]);

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
      
      // Add group color to each note if not already present
      const enrichedNotes = groupNotes.map(note => {
        if (!note.groupColor && activeGroup) {
          return {...note, groupColor: activeGroup.color};
        }
        return note;
      });
      
      // Sort notes by updatedAt in descending order (newest first)
      const sortedNotes = [...enrichedNotes].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      
      setNotes(sortedNotes);
      
      // On mobile, hide sidebar when group is selected
      if (isMobileView) {
        setShowSidebar(false);
      }
    } else {
      setNotes([]);
    }
  }, [activeGroupId, activeGroup, isMobileView]);

  // Handle group selection
  const handleGroupSelect = (groupId: string) => {
    setActiveGroupId(groupId);
  };

  // Handle new group added
  const handleGroupAdded = (group: Group) => {
    setGroups([...groups, group]);
    setActiveGroupId(group.id);
  };

  // Handle group deleted
  const handleGroupDeleted = (groupId: string) => {
    const success = deleteGroup(groupId);
    
    if (success) {
      // Update groups list
      const updatedGroups = groups.filter(group => group.id !== groupId);
      setGroups(updatedGroups);
      
      // If the active group was deleted, select another group or set to null
      if (activeGroupId === groupId) {
        if (updatedGroups.length > 0) {
          setActiveGroupId(updatedGroups[0].id);
        } else {
          setActiveGroupId(null);
        }
      }
      
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
    }
  };

  // Handle new note added
  const handleNoteAdded = (note: Note) => {
    setNotes([note, ...notes]);
  };

  // Handle note edited
  const handleNoteEdited = (noteId: string, content: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { ...note, content, updatedAt: new Date().toISOString() } 
        : note
    );
    
    // Sort notes by updatedAt in descending order (newest first)
    const sortedNotes = [...updatedNotes].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    setNotes(sortedNotes);
  };

  // Handle note deleted
  const handleNoteDeleted = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
  };

  // Toggle sidebar in mobile view
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Back button handler for mobile
  const handleBackToGroups = () => {
    if (isMobileView) {
      setShowSidebar(true);
    }
  };

  return (
    <div className="notes-app">
      {/* Mobile back button */}
      {isMobileView && activeGroupId && !showSidebar && (
        <button className="notes-mobile-back" onClick={handleBackToGroups}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      )}
      
      {/* Sidebar / Group List */}
      {showSidebar && (
        <GroupList
          groups={groups}
          activeGroupId={activeGroupId}
          onGroupSelect={handleGroupSelect}
          onCreateGroup={() => setShowGroupModal(true)}
          onDeleteGroup={handleGroupDeleted}
        />
      )}
      
      {/* Main Content */}
      <div className="notes-main">
        <NoteContent 
          notes={notes} 
          groupName={activeGroupName}
          onNoteEdited={handleNoteEdited}
          onNoteDeleted={handleNoteDeleted}
        />
        <NoteInput 
          groupId={activeGroupId}
          groupColor={activeGroupColor} 
          onNoteAdded={handleNoteAdded} 
        />
      </div>
      
      {/* Create Group Modal */}
      <GroupModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        onGroupAdded={handleGroupAdded}
      />
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default NoteApp;
