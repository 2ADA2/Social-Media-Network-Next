import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccountRequest } from "./update-account";
import { useAppDispatch } from "@/app/store/hooks";
import { setCredentials, setUser } from "@/entities/user/model/user-slice";
import { mapUser } from "@/entities/user";
import updateToken from "@/shared/lib/update-token";

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: updateAccountRequest,
    onSuccess: (data) => {
      const user = mapUser(data.user);

      if (data.token && data.refreshToken) {
        updateToken(data.token);
        dispatch(setCredentials({ user, token: data.token }));
      } else {
        dispatch(setUser(user));
        queryClient.setQueryData(["me"], data.user);
      }
    },
  });
};
