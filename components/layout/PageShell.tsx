import TopBar from "./TopBar";
import Navbar from "./Navbar";
import SecondNav from "./SecondNav";
import Footer from "./Footer";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Navbar />
      <SecondNav />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
