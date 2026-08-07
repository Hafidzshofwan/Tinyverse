import { HomeGreeting, HomeQuickAccess, HomeFavorites } from "@/widgets/home-dashboard";

export default function HomePage() {
  return (
    <div className="tv-stack">
      <HomeGreeting />
      <HomeQuickAccess />
      <HomeFavorites />
    </div>
  );
}
