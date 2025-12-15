import { HeroSlider } from "@/components/hero/HeroSlider";
import { Header } from "@/components/layout/Header";
import { LiveToday } from "@/components/live/LiveToday";
import { HomePage as HomeContent } from "@/components/home/HomePage";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSlider />
      <LiveToday />
      <HomeContent />
    </>
  );
}
