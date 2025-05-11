import { Leaf } from 'lucide-react';
import type React from 'react';

const Logo: React.FC<{ className?: string; iconSize?: number; textSize?: string }> = ({ className, iconSize = 24, textSize = "text-xl" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Leaf color="hsl(var(--primary))" size={iconSize} />
      <h1 className={`font-bold ${textSize} text-foreground`}>EcoTrack</h1>
    </div>
  );
};

export default Logo;
