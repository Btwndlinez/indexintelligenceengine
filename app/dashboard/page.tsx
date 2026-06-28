import DesktopDashboard from "@/components/desktop/DesktopDashboard";
import MobileDashboard from "@/components/mobile/MobileDashboard";

export default function DashboardPage() {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopDashboard />
      </div>

      <div className="block lg:hidden">
        <MobileDashboard />
      </div>
    </>
  );
}
