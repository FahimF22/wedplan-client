import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
