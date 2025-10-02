// Safe Icons Utility
// This utility provides safe wrappers for lucide-react icons to prevent forwardRef errors

import React from 'react';

// Safe icon wrapper that handles forwardRef issues
export const createSafeIcon = (IconComponent) => {
  return React.forwardRef((props, ref) => {
    try {
      return <IconComponent {...props} ref={ref} />;
    } catch (error) {
      console.warn('Icon component failed, using fallback:', error);
      // Fallback: return a simple div with the icon name
      return <div {...props} ref={ref} data-icon="fallback" />;
    }
  });
};

// Safe icon wrapper without forwardRef
export const createSafeIconNoRef = (IconComponent) => {
  return (props) => {
    try {
      return <IconComponent {...props} />;
    } catch (error) {
      console.warn('Icon component failed, using fallback:', error);
      // Fallback: return a simple div
      return <div {...props} data-icon="fallback" />;
    }
  };
};

// Ensure React.forwardRef is available before creating icons
if (typeof React.forwardRef === 'undefined') {
  console.error('React.forwardRef is not available, icons may not work properly');
}
