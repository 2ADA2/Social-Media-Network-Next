export interface SuggestedPeopleResponse {
  id: number;
  username: string;
  firstName: string | null;
  secondName: string | null;
  description: string | null;
  photo: string | null;
}

export interface CommunityResponse {
  id: number;
  title: string;
  photo: string | null;
  membersCount: number;
}
