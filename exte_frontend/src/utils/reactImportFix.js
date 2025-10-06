// React Import Fix Utility
// This utility ensures React and forwardRef are properly available

// Import React - this will be available after main.jsx imports it
import React from 'react';

// Ensure React is available globally - with safety checks
if (typeof window !== 'undefined') {
  try {
    // Set React globally if not already set
    if (typeof window.React === 'undefined' && React) {
      window.React = React;
    }
    
    // Ensure forwardRef is available - CRITICAL for Vercel deployment
    if (window.React && React && typeof window.React.forwardRef === 'undefined' && React.forwardRef) {
      window.React.forwardRef = React.forwardRef;
    }
    
    // Additional safety: ensure forwardRef is available on the global React object
    if (window.React && typeof window.React.forwardRef === 'undefined') {
      window.React.forwardRef = (component) => component;
    }
  } catch (error) {
    console.warn('Failed to set up global React:', error);
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


