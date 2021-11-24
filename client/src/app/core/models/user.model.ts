export interface User {
  _id: string;
  email: string;
  username: string;
  password: string;
  entities: string[];
  comments: string[];
  imageId: string;
}
