import { HomeGreeting, HomeQuickAccess, HomeInsight, HomeUpdate, HomeFavorites } from "@/widgets/home-dashboard";

export default function HomePage() {
  return (
    <div className="tv-stack">
      <HomeGreeting />
      <HomeQuickAccess />
      <div className="tv-home-cols">
        <HomeInsight />
        <HomeUpdate />
      </div>
      <HomeFavorites />
    </div>
  );
}
