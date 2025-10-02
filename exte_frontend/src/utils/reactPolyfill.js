// React Polyfill for Vercel Deployment
// This ensures React.forwardRef is always available

import React from 'react';

// Ensure React.forwardRef is available
if (typeof React.forwardRef === 'undefined') {
  console.warn('React.forwardRef is undefined, creating polyfill...');
  
  // Create a basic forwardRef implementation
  React.forwardRef = function forwardRef(render) {
    if (typeof render !== 'function') {
      console.error('forwardRef requires a function as its argument');
      return render;
    }
    
    const ForwardRefComponent = React.createElement(render);
    ForwardRefComponent.$$typeof = Symbol.for('react.forward_ref');
    ForwardRefComponent.render = render;
    return ForwardRefComponent;
  };
}

// Ensure forwardRef is available globally
if (typeof window !== 'undefined') {
  if (typeof window.React === 'undefined') {
    window.React = React;
  }
  
  if (typeof window.React.forwardRef === 'undefined') {
    window.React.forwardRef = React.forwardRef;
  }
}

// Export the polyfilled React
export default React;
export { React };
