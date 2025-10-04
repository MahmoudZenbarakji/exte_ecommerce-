// Global React Fix for Vercel Deployment
// This ensures React.forwardRef is always available globally

// Import React - this will be available after main.jsx imports it
import React from 'react';

// Create a comprehensive forwardRef polyfill
const createForwardRefPolyfill = () => {
  return function forwardRef(render) {
    if (typeof render !== 'function') {
      console.error('forwardRef requires a function as its argument');
      return render;
    }
    
    // Create a component that can handle refs
    const ForwardRefComponent = function(props, ref) {
      return render(props, ref);
    };
    
    // Set the display name for debugging
    ForwardRefComponent.displayName = `ForwardRef(${render.displayName || render.name || 'Component'})`;
    
    // Mark as forward ref for React DevTools
    ForwardRefComponent.$$typeof = Symbol.for('react.forward_ref');
    ForwardRefComponent.render = render;
    
    return ForwardRefComponent;
  };
};

// Apply the polyfill if forwardRef is missing
if (typeof React.forwardRef === 'undefined') {
  console.warn('React.forwardRef is undefined, applying polyfill...');
  React.forwardRef = createForwardRefPolyfill();
}

// Ensure it's available globally
if (typeof window !== 'undefined') {
  if (typeof window.React === 'undefined') {
    window.React = React;
  }
  
  if (typeof window.React.forwardRef === 'undefined') {
    window.React.forwardRef = React.forwardRef;
  }
}

// Also ensure it's available on the global React object
if (typeof global !== 'undefined' && global.React) {
  global.React.forwardRef = React.forwardRef;
}

// Export the fixed React
export default React;
export { React };
