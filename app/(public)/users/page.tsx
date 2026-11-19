import { NextPage } from "next";
import { redirect } from "next/navigation";

const UsesPage: NextPage = ({}) => {
  return redirect("/", "replace");
};

export default UsesPage;
