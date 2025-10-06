// Import React first to avoid circular dependencies
import React from 'react'
import { createRoot } from 'react-dom/client'

// Initialize React polyfills AFTER React is imported - in correct order
import './utils/globalReactFix.js'
import './utils/reactPolyfill.js'
import './utils/reactImportFix.js'

// Import components after React is properly initialized
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

// Initialize error detection and tests after components are loaded
import { initReactErrorDetection } from './utils/reactErrorDetector.js'
import { runAllTests } from './utils/testForwardRef.js'

// Initialize React error detection - with safety check
try {
  initReactErrorDetection()
} catch (error) {
  console.warn('Failed to initialize React error detection:', error)
}

// Ensure React is available globally and forwardRef is accessible - with safety checks
try {
  if (typeof window.React === 'undefined') {
    window.React = React
  }

  // Ensure forwardRef is available globally - CRITICAL for Vercel deployment
  if (typeof window.React.forwardRef === 'undefined' && React.forwardRef) {
    window.React.forwardRef = React.forwardRef
  }

  // Make sure React.forwardRef is available on the React object itself
  if (typeof React.forwardRef === 'undefined') {
    console.error('React.forwardRef is undefined! This will cause component errors.');
    // Create a safe forwardRef implementation
    React.forwardRef = (component) => {
      const ForwardRefComponent = function(props, ref) {
        return component(props, ref);
      };
      ForwardRefComponent.displayName = `ForwardRef(${component.displayName || component.name || 'Component'})`;
      ForwardRefComponent.$$typeof = Symbol.for('react.forward_ref');
      return ForwardRefComponent;
    };
  }

  // Additional safety: ensure forwardRef is available on global React
  if (typeof window !== 'undefined' && window.React) {
    window.React.forwardRef = window.React.forwardRef || React.forwardRef;
  }
} catch (error) {
  console.warn('Failed to set up global React:', error)
}

// Run forwardRef tests - with safety check
try {
  runAllTests();
} catch (error) {
  console.warn('Failed to run forwardRef tests:', error)
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

const root = createRoot(rootElement)
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
