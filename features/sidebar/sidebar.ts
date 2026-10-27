import { queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/api-client';
import type { CommunityResponse, SuggestedPeopleResponse } from "@/features/sidebar/types.ts";

const fetchSuggestedPeople = async (): Promise<SuggestedPeopleResponse[]> => {
  const { data } = await apiClient.get<SuggestedPeopleResponse[]>('/api/getSuggested');
  return data;
};

const fetchGroups = async (): Promise<CommunityResponse[]> => {
  const { data } = await apiClient.get<CommunityResponse[]>('/api/groups');
  return data;
};

export const sidebarQueries = {
  suggestedPeople: () =>
    queryOptions({
      queryKey: ['sidebar', 'suggested-users'],
      queryFn: fetchSuggestedPeople,
      staleTime: 5 * 60 * 1000,
      retry: 3,
    }),

  community: () =>
    queryOptions({
      queryKey: ['sidebar', 'groups'],
      queryFn: fetchGroups,
      staleTime: 5 * 60 * 1000,
      retry: 3,
    }),
};
