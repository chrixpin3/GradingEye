import React, { useState } from "react";
import {
  LayoutDashboard,
  FileUp,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut,
  GraduationCap
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import ProfileImg from "../assets/prof.png";

function Sidebar({ activePage, setActivePage, isOpen, setIsOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const { t } = useLanguage();

  const MENU_GROUPS = [
    {
      title: t("navigation"),
      items: [
        { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard },
        { id: "s1-1", type: "spacer" },
        { id: "s1-2", type: "spacer" },
        { id: "s1-3", type: "spacer" },
        { id: "upload", label: t("newGrading"), icon: FileUp },
        { id: "s2-1", type: "spacer" },
        { id: "s2-2", type: "spacer" },
        { id: "s2-3", type: "spacer" },
        { id: "history", label: t("historyReports"), icon: BarChart3 },
        { id: "s3-1", type: "spacer" },
        { id: "s3-2", type: "spacer" },
        { id: "s3-3", type: "spacer" },
        { id: "settings", label: t("settings"), icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed lg:relative h-screen flex flex-col z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${collapsed ? "w-[88px]" : "w-[300px]"
          } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } bg-[#0F1015]/80 backdrop-blur-2xl text-[#8F95B2] font-sans border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.3)]`}
      >
        {/* Decorative Glow Line */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />

        {/* Brand Header */}
        <div className={`flex items-center gap-4 px-8 py-10 ${collapsed ? "justify-center" : ""}`}>
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#5D5FEF] to-[#4B4DDB] rounded-2xl shadow-[0_8px_20px_rgba(93,95,239,0.3)] shrink-0 transition-transform duration-500 hover:scale-110 group cursor-pointer">
            <GraduationCap className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" size={24} />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                GradingApp
              </h1>
              <span className="text-[10px] font-black text-blue-500/80 uppercase tracking-[0.3em]">{t('institutional')}</span>
            </div>
          )}
        </div><br /><br />


        {/* Navigation Menu */}
        <nav className="flex-1 px-6 py-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {MENU_GROUPS.map((group) => (
              <li key={group.title}>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    if (item.type === "spacer") {
                      return <li key={item.id} className="h-2" />;
                    }
                    const Icon = item.icon;
                    const isActive = activePage === item.id;

                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            setActivePage(item.id);
                            setIsOpen(false);
                          }}
                          className={`group relative flex items-center w-full gap-4 px-5 py-4 rounded-2xl transition-all duration-500 ease-out overflow-hidden ${isActive
                            ? "bg-white/5 text-white shadow-[0_0_20px_rgba(93,95,239,0.15)]"
                            : "hover:bg-white/[0.03] hover:text-white"
                            }`}
                        >
                          {/* Active Accent Glow */}
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#5D5FEF] rounded-r-full shadow-[0_0_12px_#5D5FEF]" />
                          )}

                          <Icon
                            size={20}
                            className={`transition-all duration-500 ${isActive
                              ? "text-[#5D5FEF] scale-110 drop-shadow-[0_0_8px_rgba(93,95,239,0.5)]"
                              : "text-[#8F95B2] group-hover:text-white group-hover:scale-110"
                              }`}
                          />
                          {!collapsed && (
                            <span className={`text-[14px] font-semibold tracking-wide transition-all duration-500 ${isActive ? "text-white translate-x-1" : "group-hover:translate-x-1"}`}>
                              {item.label}
                            </span>
                          )}

                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/[0.02] to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer / Profile Section */}
        <div className="p-6 mt-auto space-y-4">
          {/* Profile Card */}
          <div className={`group flex items-center ${collapsed ? "justify-center" : "gap-4"} p-4 rounded-[24px] border border-white/5 bg-white/5 backdrop-blur-lg transition-all duration-500 hover:bg-white/[0.08] hover:border-white/10`}>
            <div className="relative shrink-0">
              <img
                src={ProfileImg}
                alt="Profile"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all duration-500"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0F1015] rounded-full" />
            </div>

            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-white truncate">{user ? user.username : t("user")}</span>
                <span className="text-[10px] text-[#8F95B2] font-semibold truncate tracking-wider uppercase opacity-60">
                  {t('boardMember')}
                </span>
              </div>
            )}

            {!collapsed && (
              <button
                onClick={logout}
                className="ml-auto p-2 text-[#8F95B2] hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group/logout"
                title={t('logout')}
              >
                <LogOut size={18} className="transition-transform group-hover/logout:rotate-12" />
              </button>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 text-[#8F95B2] hover:text-white transition-all duration-500 group/toggle"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/0 group-hover/toggle:bg-white/5 transition-all">
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              {!collapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover/toggle:opacity-100 transition-opacity">{t('collapse')}</span>}
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;