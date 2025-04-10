
export interface Note {
  id: string;
  content: string;
  groupId: string;
  groupColor?: string; // Added to store group color with each note
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  color: string;
}
