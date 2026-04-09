export interface Comment {
  id: string;
  NoteId: number;
  Text: string;
  Username: string;
  CreatedAt: string;
}

export interface CommentThread {
  id: string;
  comments: Comment[];
}
