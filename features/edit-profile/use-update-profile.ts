import {useAppDispatch} from '@/app/store/hooks';
import {User} from '@/entities/user';
import {setUser} from '@/entities/user/model/user-slice';
import {updateProfileRequest} from '@/features/edit-profile/update-profile-api';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: (user) => {
      if (user !== undefined) {
        dispatch(setUser(user));
        queryClient.setQueryData(['me'], user);
      } else {
        throw new Error("cannot get user ( undefined )")
      }
    },
  });
};
