import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Intro from "@/components/site/Intro";
import Highlights from "@/components/site/Highlights";
import Marquee from "@/components/site/Marquee";
import Sustainability from "@/components/site/Sustainability";
import GrandMasters from "@/components/site/GrandMasters";
import BookConsultation from "@/components/site/BookConsultation";
import Footer from "@/components/site/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <main data-testid="landing-page" className="bg-[#FAF9F6]">
        <Navbar />
        <Hero />
        <Intro />
        <Highlights />
        <Marquee />
        <Sustainability />
        <GrandMasters />
        <BookConsultation />
        <Footer />
      </main>
    </SmoothScrollProvider>
  );
}
