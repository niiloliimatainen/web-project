export interface Entity {
  _id: string;
  user: string;
  title: string;
  content: string;
  codeSnippet: string;
  modified: string;
  comments: string[];
  likes: number;
  dislikes: number;
}
