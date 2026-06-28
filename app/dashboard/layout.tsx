import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { Zap } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <div className="lg:flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 min-w-0 w-full overflow-x-hidden">
          <div className="hidden lg:block">
            <Topbar />
          </div>
          <div className="lg:hidden h-16 px-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 bg-red rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-bold text-base tracking-tight">IIE</span>
          </div>
          <div className="p-3 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
