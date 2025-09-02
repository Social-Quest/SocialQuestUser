import { useState, useEffect, useCallback } from 'react';

interface TableauZoomOptions {
  defaultScale?: number;
  enableAutoZoom?: boolean;
  onZoomChange?: (scale: number) => void;
}

export const useTableauZoom = (options: TableauZoomOptions = {}) => {
  const {
    defaultScale = 0.65, // 65% zoom level
    enableAutoZoom = true,
    onZoomChange
  } = options;

  const [currentScale, setCurrentScale] = useState(defaultScale);
  const [isTableauContent, setIsTableauContent] = useState(false);

  // Calculate proper scaling dimensions
  const getScalingStyle = useCallback((scale: number = currentScale) => {
    const compensatedWidth = `${(100 / scale)}%`;
    const compensatedHeight = `${(100 / scale)}%`;
    
    return {
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      width: compensatedWidth,
      height: compensatedHeight,
      overflow: 'hidden' as const
    };
  }, [currentScale]);

  // Update zoom level
  const updateZoom = useCallback((newScale: number) => {
    const clampedScale = Math.max(0.25, Math.min(1.5, newScale)); // Limit scale between 25% and 150%
    setCurrentScale(clampedScale);
    onZoomChange?.(clampedScale);
  }, [onZoomChange]);

  // Reset to default zoom
  const resetZoom = useCallback(() => {
    updateZoom(defaultScale);
  }, [defaultScale, updateZoom]);

  // Auto-detect if content is Tableau
  const detectTableauContent = useCallback((url: string) => {
    const isTableau = url.includes('tableau.com');
    setIsTableauContent(isTableau);
    return isTableau;
  }, []);

  // Apply zoom when Tableau content is detected
  useEffect(() => {
    if (enableAutoZoom && isTableauContent) {
      // Small delay to ensure content is loaded before applying zoom
      const timer = setTimeout(() => {
        updateZoom(defaultScale);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isTableauContent, enableAutoZoom, defaultScale, updateZoom]);

  return {
    currentScale,
    isTableauContent,
    getScalingStyle,
    updateZoom,
    resetZoom,
    detectTableauContent
  };
};
