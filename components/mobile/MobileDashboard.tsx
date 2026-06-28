import MobileHeader from "./MobileHeader";
import MobileSearchCard from "./MobileSearchCard";
import MobileResults from "./MobileResults";

export default function MobileDashboard() {
  return (
    <div className="min-h-screen bg-black pb-24">
      <MobileHeader />

      <div className="p-4 space-y-6">
        <MobileSearchCard />
        <MobileResults />
      </div>
    </div>
  );
}
