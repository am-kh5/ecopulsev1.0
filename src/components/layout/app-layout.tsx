"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Brain,
  Trophy,
  FileText,
  ShoppingCart,
  Settings,
  PanelLeft,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import Logo from './logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Leaf } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  tooltip: string;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
  { href: '/prediction', label: 'Prediction', icon: Brain, tooltip: 'Carbon Footprint Prediction' },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy, tooltip: 'Leaderboard' },
  { href: '/reports', label: 'Reports', icon: FileText, tooltip: 'Reports' },
  { href: '/subscription', label: 'Subscription', icon: ShoppingCart, tooltip: 'Subscription' },
];

const PageHeader = () => {
  const pathname = usePathname();
  const { toggleSidebar, isMobile, state: sidebarState, collapsible } = useSidebar(); 
  const currentNavItem = navItems.find(item => pathname.startsWith(item.href));
  const pageTitle = currentNavItem ? currentNavItem.label : pathname.startsWith('/settings') ? 'Settings' : "EcoTrack";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
        {(isMobile || (collapsible === 'icon' && sidebarState === 'collapsed')) && ( 
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0" 
            onClick={toggleSidebar}
            aria-label="Toggle Menu"
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        )}
      <h1 className="text-xl font-semibold text-foreground flex-1">{pageTitle}</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="User Account Menu">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://picsum.photos/100/100" alt="User Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};


const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // This block is rendered on the server and on the initial client render.
    // It MUST match the server output to avoid hydration errors.
    // The classes for <aside> and the structure for the main content area
    // are adjusted to match the server output reported in the hydration error.
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-primary" />
             <h1 className='font-bold text-2xl text-foreground'>EcoTrack</h1>
          </div>
          <div className="flex-1"></div> {/* Placeholder for title */}
           <Avatar className="h-8 w-8">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
        </header>
        <div className="flex flex-1">
          <aside className="hidden md:block w-16 lg:w-64 border-r bg-sidebar"></aside> {/* Matches server output for aside from error log */}
          {' '} {/* Matches server output for main content area from error log */}
        </div>
      </div>
    );
  }

  // This block is rendered on the client after useEffect sets mounted to true.
  return (
    <SidebarProvider defaultOpen={false} collapsible="icon">
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader> 
          <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]/sidebar:justify-center">
            <Logo iconSize={28} textSize="text-2xl" />
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={{ children: item.tooltip, className: "bg-popover text-popover-foreground shadow-md" }}
                    className="justify-start" 
                    size="default" 
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>  
           <SidebarMenu>
             <SidebarMenuItem>
                <Link href="/settings" legacyBehavior passHref>
                    <SidebarMenuButton 
                        isActive={pathname.startsWith('/settings')}
                        tooltip={{ children: "Settings", className: "bg-popover text-popover-foreground shadow-md"}}
                        className="justify-start"
                        size="default" 
                    >
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                    </SidebarMenuButton>
                </Link>
             </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <PageHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;