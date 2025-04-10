
export interface Note {
  id: string;
  content: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  color: string;
}
