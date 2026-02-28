import { HeroSection } from "@/components/home/HeroSection";
import { TrustSignals } from "@/components/home/TrustSignals";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedHolidays } from "@/components/home/FeaturedHolidays";
import { SpecialOffers } from "@/components/home/SpecialOffers";
import { getFeaturedHolidays, getSpecialOffers } from "@/lib/holidays";

export default async function HomePage() {
  const [featured, offers] = await Promise.all([
    getFeaturedHolidays(6),
    getSpecialOffers(4),
  ]);

  return (
    <>
      <TrustSignals />
      <HeroSection />
      <CategoryGrid />
      <FeaturedHolidays holidays={featured} />
      <SpecialOffers offers={offers} />
    </>
  );
}
