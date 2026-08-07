import { HomeGreeting, HomeQuickAccess, HomeFavorites, HomeInsight, HomeUpdate } from "@/widgets/home-dashboard";

export default function HomePage() {
  return (
    <div className="tv-stack">
      <HomeGreeting />
      <HomeQuickAccess />
      <HomeFavorites />
      <div className="tv-home-cols">
        <HomeInsight />
        <HomeUpdate />
      </div>
    </div>
  );
}
