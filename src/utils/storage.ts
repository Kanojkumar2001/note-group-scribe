
import { Group, Note } from "../types";
import { toast } from "@/hooks/use-toast";

// Storage keys
const GROUPS_KEY = "notes_app_groups";
const NOTES_KEY = "notes_app_notes";

// Get all groups from localStorage
export const getGroups = (): Group[] => {
  const groups = localStorage.getItem(GROUPS_KEY);
  return groups ? JSON.parse(groups) : [];
};

// Save groups to localStorage
export const saveGroups = (groups: Group[]): void => {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
};

// Add a new group
export const addGroup = (group: Group): boolean => {
  const groups = getGroups();
  
  // Check for duplicate group names
  if (groups.some(g => g.name.toLowerCase() === group.name.toLowerCase())) {
    return false;
  }
  
  saveGroups([...groups, group]);
  return true;
};

// Delete a group
export const deleteGroup = (groupId: string): boolean => {
  try {
    // Get groups and filter out the one to delete
    const groups = getGroups();
    const filteredGroups = groups.filter(group => group.id !== groupId);
    
    if (filteredGroups.length === groups.length) {
      toast({
        title: "Error",
        description: "Group not found",
        variant: "destructive"
      });
      return false;
    }
    
    // Delete all notes associated with the group
    const notes = getNotes();
    const filteredNotes = notes.filter(note => note.groupId !== groupId);
    
    // Save updated groups and notes
    saveGroups(filteredGroups);
    saveNotes(filteredNotes);
    
    return true;
  } catch (error) {
    console.error("Error deleting group:", error);
    toast({
      title: "Error",
      description: "Failed to delete group",
      variant: "destructive"
    });
    return false;
  }
};

// Get all notes from localStorage
export const getNotes = (): Note[] => {
  const notes = localStorage.getItem(NOTES_KEY);
  return notes ? JSON.parse(notes) : [];
};

// Save notes to localStorage
export const saveNotes = (notes: Note[]): void => {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

// Get notes for a specific group
export const getGroupNotes = (groupId: string): Note[] => {
  const notes = getNotes();
  return notes.filter(note => note.groupId === groupId);
};

// Add a new note
export const addNote = (note: Note): void => {
  const notes = getNotes();
  saveNotes([...notes, note]);
};

// Edit an existing note
export const editNote = (noteId: string, content: string): boolean => {
  try {
    const notes = getNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    
    if (noteIndex === -1) {
      toast({
        title: "Error",
        description: "Note not found",
        variant: "destructive"
      });
      return false;
    }
    
    // Update content and updatedAt timestamp
    const updatedNote = {
      ...notes[noteIndex],
      content,
      updatedAt: new Date().toISOString()
    };
    
    notes[noteIndex] = updatedNote;
    saveNotes(notes);
    return true;
  } catch (error) {
    console.error("Error editing note:", error);
    toast({
      title: "Error",
      description: "Failed to edit note",
      variant: "destructive"
    });
    return false;
  }
};

// Delete a note
export const deleteNote = (noteId: string): boolean => {
  try {
    const notes = getNotes();
    const filteredNotes = notes.filter(note => note.id !== noteId);
    
    if (filteredNotes.length === notes.length) {
      toast({
        title: "Error",
        description: "Note not found",
        variant: "destructive"
      });
      return false;
    }
    
    saveNotes(filteredNotes);
    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    toast({
      title: "Error",
      description: "Failed to delete note",
      variant: "destructive"
    });
    return false;
  }
};

// Generate a random color
export const getRandomColor = (): string => {
  const colors = [
    "#F44336", "#E91E63", "#9C27B0", "#673AB7", 
    "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", 
    "#009688", "#4CAF50", "#8BC34A", "#CDDC39", 
    "#FFEB3B", "#FFC107", "#FF9800", "#FF5722"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
