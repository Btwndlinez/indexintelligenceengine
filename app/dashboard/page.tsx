import DashboardContent from "@/components/desktop/DashboardContent";
import MobileDashboard from "@/components/mobile/MobileDashboard";

export default function DashboardPage() {
  return (
    <>
      <div className="hidden lg:block">
        <DashboardContent />
      </div>

      <div className="block lg:hidden">
        <MobileDashboard />
      </div>
    </>
  );
}
