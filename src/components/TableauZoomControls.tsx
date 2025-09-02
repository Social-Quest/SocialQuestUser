import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TableauZoomControlsProps {
  currentScale: number;
  onZoomChange: (scale: number) => void;
  onReset: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
  className?: string;
}

export const TableauZoomControls: React.FC<TableauZoomControlsProps> = ({
  currentScale,
  onZoomChange,
  onReset,
  isVisible,
  onToggleVisibility,
  className = ''
}) => {
  const zoomLevels = [0.5, 0.65, 0.8, 1.0, 1.2];
  
  const handleZoomIn = () => {
    const currentIndex = zoomLevels.findIndex(level => level >= currentScale);
    const nextIndex = Math.min(currentIndex + 1, zoomLevels.length - 1);
    onZoomChange(zoomLevels[nextIndex]);
  };

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.findIndex(level => level >= currentScale);
    const prevIndex = Math.max(currentIndex - 1, 0);
    onZoomChange(zoomLevels[prevIndex]);
  };

  const getCurrentZoomLabel = () => {
    return `${Math.round(currentScale * 100)}%`;
  };

  if (!isVisible) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleVisibility}
              className="h-10 w-10 p-0 bg-white/90 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:bg-slate-100"
            >
              <Eye className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Show zoom controls</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200/50 shadow-lg ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={currentScale <= zoomLevels[0]}
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>
        
        <div className="flex items-center gap-1">
          {zoomLevels.map((level) => (
            <Tooltip key={level}>
              <TooltipTrigger asChild>
                <Button
                  variant={Math.abs(currentScale - level) < 0.01 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onZoomChange(level)}
                  className="h-8 px-2 text-xs hover:bg-slate-100"
                >
                  {Math.round(level * 100)}%
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Set zoom to {Math.round(level * 100)}%</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={currentScale >= zoomLevels[zoomLevels.length - 1]}
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-8 px-2 text-xs hover:bg-slate-100"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset to default zoom (65%)</p>
          </TooltipContent>
        </Tooltip>
        
        <div className="text-xs text-slate-700 font-semibold px-2 py-1 bg-slate-100 rounded">
          {getCurrentZoomLabel()}
        </div>

        {/* Hide button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleVisibility}
              className="h-8 w-8 p-0 hover:bg-slate-100 ml-2"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hide zoom controls</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
