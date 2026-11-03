export interface PostAuthor {
  id: number;
  username: string;
  firstName: string | null;
  secondName: string | null;
  profileImage: string | null;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  likesCount: number;
  commentsCount: number;
  creationDate: string;
  modifiedDate: string;
  author: PostAuthor;
  likedByUsers: { id: number }[];
}

export interface Like {
  id: number,
  postId: number;
  userId: number;
  creationDate: string;
}

export interface Comment {
  id: number,
  text: string;
  postId: number;
  authorId: number;
  creationDate: string;
  modifiedDate: string;
}


export interface PostsPage {
  items: Post[];
  total: number;
  limit: number;
  offset: number;
}
