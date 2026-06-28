import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <div className="lg:flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 min-w-0 w-full">
          <div className="hidden lg:block">
            <Topbar />
          </div>
          <div className="p-3 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
