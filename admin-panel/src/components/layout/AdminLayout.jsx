
import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileSidebar from "./MobileSidebar";

function AdminLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden shrink-0 lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <Header
            onMenuClick={() => setMobileSidebarOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden bg-slate-100">
            <div className="min-h-full p-4 sm:p-6 lg:p-8">
              <div className="mx-auto w-full max-w-[1600px]">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
    </div>
  );
}

export default AdminLayout;

