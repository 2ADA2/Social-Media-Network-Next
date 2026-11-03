import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { selectUser } from "@/entities/user/model/selectors";
import type { User } from "@/entities/user";
import { setUser } from "@/entities/user/model/user-slice";

export const useUser = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  return { user, setUser: (user: User) => dispatch(setUser(user)) };
};
