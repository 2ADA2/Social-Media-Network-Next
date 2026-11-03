import {useAppDispatch} from '@/app/store/hooks';
import {setUser} from '@/entities/user/model/user-slice';
import {updateProfileRequest} from '@/features/edit-profile/update-profile-api';
import {uploadAvatar} from '@/features/edit-profile/upload-avatar';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (file: File) => {
      const url = await uploadAvatar(file);
      return updateProfileRequest({profileImage: url});
    },
    onSuccess: (user) => {
      if (user !== undefined) {
        dispatch(setUser(user));
        queryClient.setQueryData(['me'], user);
      } else {
        throw new Error('cannot get user (undefined)');
      }
    },
  });
};
