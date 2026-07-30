"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  PenBox, 
  GraduationCap, 
  Video, 
  Map, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume Builder", href: "/resume", icon: FileText },
  { name: "Cover Letter", href: "/ai-cover-letter", icon: PenBox },
  { name: "Mock Interview", href: "/interview", icon: GraduationCap },
  { name: "Prep Quiz", href: "/prep-quiz", icon: BrainCircuit },
  { name: "Course Generator", href: "/courses", icon: Video },
  { name: "Career Roadmap", href: "/roadmap", icon: Map },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          size="icon"
          className="rounded-full h-14 w-14 shadow-2xl bg-primary hover:bg-primary/90 text-white"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-[#030207] border-r border-[#1a162b] z-40 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full py-6">
          {/* Header/Logo Placeholder or Spacing */}
          <div className="px-6 mb-10 mt-16 lg:mt-0 flex items-center justify-between">
             {!isCollapsed && <span className="text-xl font-black text-white tracking-widest uppercase">k.AI</span>}
             <Button 
                variant="ghost" 
                size="icon" 
                className="hidden lg:flex text-white/40 hover:text-white"
                onClick={() => setIsCollapsed(!isCollapsed)}
             >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
             </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-primary" : "text-white/40 group-hover:text-white"
                  )} />
                  
                  {!isCollapsed && (
                    <span className="font-medium text-sm whitespace-nowrap overflow-hidden">
                      {item.name}
                    </span>
                  )}

                  {/* Active Indicator Glow */}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                  )}

                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-white text-black text-xs font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
                          {item.name}
                      </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Info */}
          {!isCollapsed && (
            <div className="px-6 mt-auto">
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-white/80 font-medium">System Ready</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
