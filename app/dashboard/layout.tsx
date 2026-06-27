import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <Topbar />
      <main className="ml-[280px] pt-[72px] px-8 pb-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
