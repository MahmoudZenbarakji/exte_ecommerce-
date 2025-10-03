// React polyfill for production builds
import React from 'react';

// Ensure forwardRef is available globally for Lucide React
if (typeof window !== 'undefined') {
  window.React = React;
  
  // Polyfill forwardRef if it's not available
  if (!React.forwardRef) {
    React.forwardRef = (Component) => {
      return (props, ref) => {
        return <Component {...props} ref={ref} />;
      };
    };
  }
}

export default React;