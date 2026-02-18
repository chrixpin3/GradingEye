import React, { useState } from "react";
import Sidebar from "./Sidebar";
import FileUpload from "./FileUpload";
import GradingHistory from "./GradingHistory";
import Dashboard from "./Dashboard";
import Settings from "./SettingsPage";
import GlobalChat from "./GlobalChat";

function MainLayout() {
  const [activePage, setActivePage] = useState("upload");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "upload":
        return <FileUpload />;
      case "history":
        return <GradingHistory />;
      case "settings":
        return <Settings />;
      default:
        return <FileUpload />;
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#0a0a0c]">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 px-6 flex items-center justify-between bg-[#0F1015]/80 backdrop-blur-xl border-b border-white/5 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#5D5FEF] to-[#4B4DDB] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span className="text-white font-bold tracking-tight">GradingApp</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-[#8F95B2] hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative overflow-auto scroll-smooth custom-scrollbar mt-16 lg:mt-0">
        {/* Background Pattern */}
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0c] to-[#0a0a0c] pointer-events-none" />
        <div className="fixed inset-0 z-0 bg-grid-slate-800/[0.05] pointer-events-none" />

        {/* Dynamic Content */}
        <div className="relative z-10 min-h-screen">
          <div className="animate-fade-in-up">
            {renderContent()}
          </div>
        </div>

        {/* Global Assistant */}
        <GlobalChat />
      </main>
    </div>
  );
}

export default MainLayout;