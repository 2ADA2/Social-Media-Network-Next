export interface User {
  id: string;
  name: string;
  username: string;
  surname?: string;
  email: string;
  avatar: string;
  description: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  profileImage: string;
  bio: string;
  firstName: string;
  secondName: string;
  description: string;
  lastLogin: string;
  creationDate: string;
  modifiedDate: string;
}
