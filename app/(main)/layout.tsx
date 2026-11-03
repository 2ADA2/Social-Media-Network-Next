import { MainHeader } from "../_components/main-header";
import { MainFooter } from "../_components/main-footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainHeader />
      <main className="main">{children}</main>
      <MainFooter />
    </>
  );
}
