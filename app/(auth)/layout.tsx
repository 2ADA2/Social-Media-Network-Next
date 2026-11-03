import { MainHeader } from "../_components/main-header";
import { MainFooter } from "../_components/main-footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainHeader hiddenNav={true}/>
      <main className="main">{children}</main>
      <MainFooter />
    </>
  );
}
