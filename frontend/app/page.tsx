import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/Home/HeroSection";

export default function HomePage() {
  return (
    <main className="home-root">
      <Navbar />
      <HeroSection />
      <Footer />

      <style>{`
        .home-root {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #ede9fe 0%, #dbeafe 50%, #e0e7ff 100%);
          font-family: 'Inter', system-ui, sans-serif;
        }
      `}</style>
    </main>
  );
}