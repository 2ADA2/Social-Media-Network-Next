import { NextPage } from "next";
import { UserPageSkeleton } from "./_components/user-page-skeleton";

const Loading: NextPage = () => {
  return <UserPageSkeleton />;
};

export default Loading;
