import { Metadata, NextPage } from "next";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: UserPageProps): Promise<Metadata> => {
  const { id } = await params;

  return {
    title: `${id} | Sidekick Social`,
    description: id,
  };
};

const UserPage: NextPage<UserPageProps> = async ({ params }) => {
  const { id } = await params;
  return <div>user {id}</div>;
};

export default UserPage;
