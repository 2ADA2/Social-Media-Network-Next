export interface CommentInterface {
  id: number;
  text: string;
  authorId: number;
  postId: number;
  creationDate: string;
  modifiedDate: string;
  author: PublicUser | null;
}

export interface PublicUser {
  id: number;
  username: string;
  firstName: string | null;
  secondName: string | null;
  description: string | null;
  bio: string | null;
  profileImage: string | null;
  creationDate: string | null;
}
