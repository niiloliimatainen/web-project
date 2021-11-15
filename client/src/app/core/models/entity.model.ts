export interface Entity {
  _id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  codeSnippet: string;
  modified: string;
  comments: string[];
  likes: number;
  dislikes: number;
}
