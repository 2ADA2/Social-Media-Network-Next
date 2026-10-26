import type { PublicUser } from '@/entities/comment/types';
import type { UserResponse } from '@/entities/user';
import type {
  CommunityResponse,
  SuggestedPeopleResponse,
} from '@/features/sidebar/types';

export const mockUserResponse: UserResponse = {
  id: 1,
  username: 'helenahills',
  email: 'helena.hills@social.com',
  profileImage: '/assets/user-helena.png',
  bio: 'Travel and design enthusiast.',
  firstName: 'Helena',
  secondName: 'Hills',
  description: 'Frontend developer',
  lastLogin: '2026-09-21T15:58:02.314Z',
  creationDate: '2026-08-27T02:05:25.834Z',
  modifiedDate: '2026-09-08T09:48:52.088Z',
};

export const userAlice: PublicUser = {
  id: 2,
  username: 'alicesmith',
  firstName: 'Alice',
  secondName: 'Smith',
  description: 'Frontend developer',
  bio: 'Loves React and TypeScript',
  profileImage: 'https://example.com/avatar.png',
  creationDate: '2026-01-01T12:00:00Z',
};

export const userBob: PublicUser = {
  id: 3,
  username: 'bobkage',
  firstName: 'Bob',
  secondName: 'Kage',
  description: 'Backend developer',
  bio: 'Loves Java and Spring',
  profileImage: 'https://example.com/avatar.png',
  creationDate: '2026-02-01T14:00:00Z',
};

export const suggestedUserAlice: SuggestedPeopleResponse = {
  id: 2,
  username: 'alicesmith',
  firstName: 'Alice',
  secondName: 'Smith',
  description: 'Frontend developer',
  photo: 'https://example.com/avatar.png',
};

export const suggestedUserBob: SuggestedPeopleResponse = {
  id: 3,
  username: 'bobkage',
  firstName: 'Bob',
  secondName: 'Kage',
  description: 'Backend developer',
  photo: 'https://example.com/avatar.png',
};

export const communityReact: CommunityResponse = {
  id: 1,
  title: 'React Developers',
  photo: 'https://example.com/react.png',
  membersCount: 150,
};

export const communityTypeScript: CommunityResponse = {
  id: 2,
  title: 'TypeScript Enthusiasts',
  photo: null,
  membersCount: 320,
};
