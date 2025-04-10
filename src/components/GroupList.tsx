
import { Group } from "../types";

interface GroupListProps {
  groups: Group[];
  activeGroupId: string | null;
  onGroupSelect: (groupId: string) => void;
  onCreateGroup: () => void;
}

const GroupList = ({ 
  groups, 
  activeGroupId, 
  onGroupSelect, 
  onCreateGroup 
}: GroupListProps) => {
  // Get first two letters of group name for the avatar
  const getInitials = (name: string): string => {
    return name.substring(0, 2).toUpperCase();
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
        {groups.map((group) => (
          <div
            key={group.id}
            className={`notes-group-item ${activeGroupId === group.id ? 'active' : ''}`}
            onClick={() => onGroupSelect(group.id)}
          >
            <div 
              className="notes-group-avatar" 
              style={{ backgroundColor: group.color, color: 'white' }}
            >
              {getInitials(group.name)}
            </div>
            <div>{group.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
