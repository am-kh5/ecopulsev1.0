'use client';

import { Leaf } from 'lucide-react';
import type React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar'; // Import useSidebar

const Logo: React.FC<{ className?: string; iconSize?: number; textSize?: string }> = ({ className, iconSize = 24, textSize = "text-xl" }) => {
  const sidebarContext = useSidebar();
  
  // Default to expanded state (text visible) if not within SidebarProvider context
  // or if the context itself indicates an expanded state.
  const isTextVisible = !sidebarContext || sidebarContext.state === 'expanded';

  return (
    <div className={cn(`flex items-center gap-2`, className)}>
      <Leaf color="hsl(var(--primary))" size={iconSize} />
      <h1 className={cn(
        'font-bold', 
        textSize, 
        'text-foreground', 
        // Apply transition only if in sidebar context, as state changes there
        sidebarContext ? 'transition-all duration-350 ease-out' : '', 
        // Control visibility based on sidebar state or if outside context
        isTextVisible ? 'opacity-100 w-auto visible' : 'opacity-0 w-0 invisible'
        )}>
          EcoTrack
      </h1>
    </div>
  );
};

export default Logo;
