
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
import EcoPulseIcon from '@/components/icons/ecopulse-icon'; // Import the new icon
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
  const sidebarContext = useSidebar(); 
  
  const { 
    toggleSidebar = () => {}, 
    isMobile = false, 
    state: sidebarState = 'collapsed', 
    collapsible: sidebarCollapsibleOption = 'icon', 
    isHovering = false 
  } = sidebarContext || {};


  const currentNavItem = navItems.find(item => pathname.startsWith(item.href));
  let pageTitle = "EcoPulse"; // Default title
  if (pathname === '/') {
    pageTitle = "Home";
  } else if (currentNavItem) {
    pageTitle = currentNavItem.label;
  } else if (pathname.startsWith('/settings')) {
    pageTitle = 'Settings';
  }


  const showMobileToggle = isMobile || (sidebarCollapsibleOption === 'icon' && sidebarState === 'collapsed' && !isHovering);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 shadow-sm backdrop-blur-sm sm:px-6">
        {(showMobileToggle || (isMobile && sidebarCollapsibleOption === 'offcanvas')) && ( 
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
    // The w-14 matches --sidebar-collapsed-width-icon (3.5rem)
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
          <div className="flex items-center gap-2"> {/* Simplified Logo */}
            <EcoPulseIcon className="h-7 w-7 text-primary" /> {/* Updated icon */}
             <h1 className='font-bold text-2xl text-foreground'>EcoPulse</h1>
          </div>
          <div className="flex-1"></div> {/* Placeholder for title derived from page */}
           <Avatar className="h-8 w-8"> {/* Simplified User Dropdown */}
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
        </header>
        <div className="flex flex-1">
          <aside className="hidden md:block w-14 border-r bg-sidebar"></aside> {/* Static width for SSR/pre-hydration */}
          <main className="flex-1 overflow-y-auto p-6 md:ml-14"> {/* Static margin for SSR/pre-hydration */}
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
        collapsible="icon" 
        variant="sidebar" 
        side="left"
      >
        <SidebarHeader> 
          <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]/sidebar:justify-center">
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
