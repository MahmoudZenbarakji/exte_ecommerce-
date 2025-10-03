// Import React polyfill FIRST to ensure forwardRef is available
import './utils/globalReactFix.js'
import './utils/reactPolyfill.js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { initReactErrorDetection } from './utils/reactErrorDetector.js'
import './utils/reactImportFix.js'
import { runAllTests } from './utils/testForwardRef.js'

// Initialize React error detection
initReactErrorDetection()

// Ensure React is available globally and forwardRef is accessible
if (typeof window.React === 'undefined') {
  window.React = React
}

// Ensure forwardRef is available globally - CRITICAL for Vercel deployment
if (typeof window.React.forwardRef === 'undefined') {
  window.React.forwardRef = React.forwardRef
}

// Make sure React.forwardRef is available on the React object itself
if (typeof React.forwardRef === 'undefined') {
  console.error('React.forwardRef is undefined! This will cause component errors.');
  // Force assign forwardRef if it's missing
  React.forwardRef = React.forwardRef || ((component) => component);
}

// Additional safety: ensure forwardRef is available on global React
if (typeof window !== 'undefined' && window.React) {
  window.React.forwardRef = window.React.forwardRef || React.forwardRef;
}

// Run forwardRef tests
runAllTests();

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
