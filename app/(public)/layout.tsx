import { MainFooter } from "@/app/_components/main-footer";
import { MainHeader } from "@/app/_components/main-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainHeader />
      <main className="main">{children}</main>
      <MainFooter />
    </>
  );
}
