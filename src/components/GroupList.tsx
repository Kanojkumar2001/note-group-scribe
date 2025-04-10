
import { Group } from "../types";
import { Trash2 } from "lucide-react";
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

interface GroupListProps {
  groups: Group[];
  activeGroupId: string | null;
  onGroupSelect: (groupId: string) => void;
  onCreateGroup: () => void;
  onDeleteGroup: (groupId: string) => void;
}

const GroupList = ({ 
  groups, 
  activeGroupId, 
  onGroupSelect, 
  onCreateGroup,
  onDeleteGroup
}: GroupListProps) => {
  // Get first two letters of group name for the avatar
  const getInitials = (name: string): string => {
    return name.substring(0, 2).toUpperCase();
  };

  // Handle group selection
  const handleGroupClick = (groupId: string, event: React.MouseEvent) => {
    // Don't select group if clicking delete button
    if ((event.target as HTMLElement).closest('.group-delete-btn')) {
      return;
    }
    onGroupSelect(groupId);
  };

  return (
    <div className="notes-sidebar">
      <div className="notes-sidebar-header">
        <h1 className="notes-sidebar-title">Pocket Notes</h1>
        <button 
          className="notes-create-btn" 
          onClick={onCreateGroup}
        >
          + Create Notes Group
        </button>
      </div>
      
      <div className="notes-group-list">
        {groups.length === 0 ? (
          <div className="notes-empty-groups">
            <p>No groups yet</p>
            <p>Create your first notes group!</p>
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className={`notes-group-item ${activeGroupId === group.id ? 'active' : ''}`}
              onClick={(e) => handleGroupClick(group.id, e)}
            >
              <div 
                className="notes-group-avatar" 
                style={{ backgroundColor: group.color }}
              >
                {getInitials(group.name)}
              </div>
              <div className="notes-group-name">{group.name}</div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button 
                    className="group-delete-btn"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Delete group"
                  >
                    <Trash2 size={16} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Group</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this group? All notes in this group will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDeleteGroup(group.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupList;
