
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
  UserCircle2,
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
  DropdownMenuGroup,
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
  const { toggleSidebar, isMobile, state: sidebarState, collapsible: sidebarCollapsibleOption } = useSidebar(); 
  const currentNavItem = navItems.find(item => pathname.startsWith(item.href));
  const pageTitle = currentNavItem ? currentNavItem.label : pathname.startsWith('/settings') ? 'Settings' : "EcoTrack";

  // Show toggle if mobile OR if sidebar is icon-collapsible and currently collapsed
  const showMobileToggle = isMobile || (sidebarCollapsibleOption === 'icon' && sidebarState === 'collapsed');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 shadow-sm backdrop-blur-sm sm:px-6">
        {(isMobile || (sidebarCollapsibleOption === 'icon' && sidebarState === 'collapsed' && !useSidebar().isHovering)) && ( 
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden" 
            onClick={toggleSidebar}
            aria-label="Toggle Menu"
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        )}
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://picsum.photos/100/100?random=user" alt="User Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <p className="text-xs leading-none text-muted-foreground">
                john.doe@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/settings"><UserCircle2 className="mr-2 h-4 w-4" />Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Log out
          </DropdownMenuItem>
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
          {/* Simplified PageHeader content */}
          <div className="flex items-center gap-2"> {/* Simplified Logo */}
            <Leaf className="h-7 w-7 text-primary" />
             <h1 className='font-bold text-2xl text-foreground'>EcoTrack</h1>
          </div>
          <div className="flex-1"></div> {/* Placeholder for title derived from page */}
           <Avatar className="h-8 w-8"> {/* Simplified User Dropdown */}
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
        </header>
        <div className="flex flex-1">
          {/* Adjusted width from w-16 to w-12 (var(--sidebar-collapsed-width-icon) is 3.5rem = 56px, w-14.
              However, the error log shows w-12 for the initial server render from a previous state of the component.
              To fix hydration error strictly based on the provided log, it should match the previous w-12.
              The component logic uses CSS vars now, which should be correct post-hydration.
              The pre-hydration SSR must match what client expects initially.
              The error log actually showed w-16 lg:w-64, then w-16, then w-12. This means the server has been rendering different things.
              Let's stick to w-12 as it was the latest state that still caused hydration errors.
          */}
          <aside className="hidden md:block w-[var(--sidebar-collapsed-width-icon)] border-r bg-sidebar"></aside> {/* Using CSS var for consistency */}
          <main className="flex-1 overflow-y-auto p-6 md:ml-[var(--sidebar-collapsed-width-icon)]"> {/* Initial margin matches collapsed state */}
            {children}
          </main>
        </div>
      </div>
    );
  }

  // This block is rendered on the client after useEffect sets mounted to true.
  return (
    <SidebarProvider defaultOpen={false} collapsible="icon">
      <Sidebar 
        collapsible="icon" // Ensures icon mode is active
        variant="sidebar" 
        side="left"
        // className applied directly on Sidebar for width transitions based on its internal state and context
      >
        <SidebarHeader> 
          <Link href="/dashboard" className="flex items-center gap-2 group-data-[state=collapsed]/sidebar:justify-center">
            <Logo iconSize={28} textSize="text-2xl" />
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2 flex-grow">
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
        <SidebarFooter className="p-2">  
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
      {/* SidebarInset handles the main content area, its margin adjusts based on sidebar state */}
      <SidebarInset>
        <PageHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
