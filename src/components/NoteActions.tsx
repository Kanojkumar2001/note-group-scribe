
import React, { useState } from "react";
import { Trash2, Edit, Save, X } from "lucide-react";
import { NoteActionProps } from "../types";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const NoteActions: React.FC<NoteActionProps> = ({ note, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleSave = () => {
    if (editedContent.trim() === "") {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    onEdit(note.id, editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(note.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(note.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="notes-item-edit">
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="notes-edit-textarea"
          autoFocus
          placeholder="Enter your note content..."
        />
        <div className="notes-edit-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="notes-edit-cancel"
            aria-label="Cancel editing"
          >
            <X size={18} /> Cancel
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="notes-edit-save"
            aria-label="Save note"
            disabled={editedContent.trim() === ""}
          >
            <Save size={18} /> Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-item-actions" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="notes-action-btn"
        aria-label="Edit note"
      >
        <Edit size={16} />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="notes-action-btn notes-delete-btn"
            aria-label="Delete note"
          >
            <Trash2 size={16} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NoteActions;
