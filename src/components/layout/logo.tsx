'use client';

import { Leaf } from 'lucide-react';
import type React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar'; 

const Logo: React.FC<{ className?: string; iconSize?: number; textSize?: string }> = ({ className, iconSize = 24, textSize = "text-xl" }) => {
  const sidebarContext = useSidebar();
  
  let isTextVisible = true; // Default to visible if no context
  if (sidebarContext) {
    const { state, isMobile, collapsible, isHovering } = sidebarContext;
    const isPinnedExpanded = state === 'expanded';
    // Text is visible if:
    // 1. Sidebar is pinned open.
    // 2. Or, it's icon-collapsible, currently pinned collapsed, not mobile, AND being hovered.
    // 3. Or, if it's mobile (where sidebar is an offcanvas and always shows text when open).
    const isHoverActuallyExpanding = collapsible === "icon" && isHovering && !isMobile && state === 'collapsed';
    
    if (isMobile) {
      // In mobile, the sidebar is an off-canvas, so text is always visible when it's open.
      // The 'openMobile' state from context would be more direct here if available for this specific logic,
      // but generally, if the logo is rendered in a mobile sidebar, it implies the sidebar is open.
      isTextVisible = true; 
    } else {
      isTextVisible = isPinnedExpanded || isHoverActuallyExpanding;
    }
  }

  return (
    <div className={cn(`flex items-center gap-2`, className)}>
      <Leaf color="hsl(var(--primary))" size={iconSize} />
      <h1 className={cn(
        'font-bold', 
        textSize, 
        'text-foreground whitespace-nowrap', // Added whitespace-nowrap
        // Apply transition only if in sidebar context, as state changes there
        sidebarContext ? 'transition-opacity duration-300 ease-out' : '', 
        // Control visibility based on sidebar state or if outside context
        isTextVisible ? 'opacity-100' : 'opacity-0 w-0' // Using w-0 to prevent layout shift from text disappearing
        )}>
          EcoPulse
      </h1>
    </div>
  );
};

export default Logo;
