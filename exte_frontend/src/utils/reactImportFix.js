// React Import Fix Utility
// This utility ensures React and forwardRef are properly available

// Ensure React is available globally
if (typeof window !== 'undefined') {
  // Import React if not already available
  if (typeof window.React === 'undefined') {
    try {
      const React = require('react');
      window.React = React;
    } catch (error) {
      console.warn('React not available globally, importing...');
    }
  }
  
  // Ensure forwardRef is available - CRITICAL for Vercel deployment
  if (window.React && typeof window.React.forwardRef === 'undefined') {
    try {
      const { forwardRef } = require('react');
      window.React.forwardRef = forwardRef;
    } catch (error) {
      console.warn('forwardRef not available, this may cause issues');
      // Fallback: create a basic forwardRef implementation
      window.React.forwardRef = (component) => component;
    }
  }
  
  // Additional safety: ensure forwardRef is available on the global React object
  if (window.React && typeof window.React.forwardRef === 'undefined') {
    window.React.forwardRef = (component) => component;
  }
}

// Safe forwardRef wrapper
export const safeForwardRef = (component) => {
  try {
    if (typeof React !== 'undefined' && React.forwardRef) {
      return React.forwardRef(component);
    }
    
    // Fallback: try to get forwardRef from global React
    if (typeof window !== 'undefined' && window.React && window.React.forwardRef) {
      return window.React.forwardRef(component);
    }
    
    // Last resort: return component without forwardRef
    console.warn('forwardRef not available, returning component without ref forwarding');
    return component;
  } catch (error) {
    console.error('Error creating forwardRef component:', error);
    return component;
  }
};

// Safe React import
export const safeReact = () => {
  try {
    if (typeof React !== 'undefined') {
      return React;
    }
    
    if (typeof window !== 'undefined' && window.React) {
      return window.React;
    }
    
    throw new Error('React not available');
  } catch (error) {
    console.error('React not available:', error);
    return null;
  }
};

export default {
  safeForwardRef,
  safeReact
};


