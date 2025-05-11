'use client';

import type React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar'; 
import EcoPulseIcon from '@/components/icons/ecopulse-icon'; // Import the new icon

const Logo: React.FC<{ className?: string; iconSize?: number; textSize?: string }> = ({ className, iconSize = 24, textSize = "text-xl" }) => {
  const sidebarContext = useSidebar();
  
  let isTextVisible = true; 
  if (sidebarContext) {
    const { state, isMobile, collapsible, isHovering } = sidebarContext;
    const isPinnedExpanded = state === 'expanded';
    const isHoverActuallyExpanding = collapsible === "icon" && isHovering && !isMobile && state === 'collapsed';
    
    if (isMobile) {
      isTextVisible = true; 
    } else {
      isTextVisible = isPinnedExpanded || isHoverActuallyExpanding;
    }
  } else {
    // If used outside SidebarProvider (e.g. in initial SSR for page.tsx header), assume text is visible
    // This case might occur if the SSR fallback in AppLayout is different or for pages not using AppLayout
    isTextVisible = true;
  }


  return (
    <div className={cn(`flex items-center gap-2`, className)}>
      <EcoPulseIcon size={iconSize} className="text-primary" /> {/* Replaced Leaf icon */}
      <h1 className={cn(
        'font-bold', 
        textSize, 
        'text-foreground whitespace-nowrap',
        sidebarContext ? 'transition-opacity duration-300 ease-out' : '', 
        isTextVisible ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none' // Added pointer-events-none when invisible
        )}>
          EcoPulse
      </h1>
    </div>
  );
};

export default Logo;
