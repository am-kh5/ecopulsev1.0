import { Leaf } from 'lucide-react';
import type React from 'react';
import { cn } from '@/lib/utils';

const Logo: React.FC<{ className?: string; iconSize?: number; textSize?: string }> = ({ className, iconSize = 24, textSize = "text-xl" }) => {
  return (
    <div className={cn(`flex items-center gap-2`, className)}>
      <Leaf color="hsl(var(--primary))" size={iconSize} />
      <h1 className={cn(
        'font-bold', 
        textSize, 
        'text-foreground', 
        'transition-all duration-300 ease-in-out',
        'group-data-[collapsible=icon]/sidebar:opacity-0 group-data-[collapsible=icon]/sidebar:w-0 group-data-[collapsible=icon]/sidebar:invisible'
        )}>
          EcoTrack
      </h1>
    </div>
  );
};

export default Logo;
