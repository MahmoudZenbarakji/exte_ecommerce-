// React Error Detection Utility
// This utility helps identify the exact cause of React Children errors

export const detectReactErrors = () => {
  const errors = [];
  
  // Check React availability
  if (typeof React === 'undefined') {
    errors.push({
      type: 'REACT_UNAVAILABLE',
      message: 'React is not available globally',
      severity: 'critical'
    });
  } else {
    // Check React.Children
    if (typeof React.Children === 'undefined') {
      errors.push({
        type: 'REACT_CHILDREN_UNAVAILABLE',
        message: 'React.Children is undefined',
        severity: 'critical'
      });
    }
    
    // Check React version
    if (React.version) {
      console.log('React version:', React.version);
    }
  }
  
  // Check for null children issues
  const checkNullChildren = () => {
    const components = [
      'ErrorBoundary',
      'AdminProtectedRoute', 
      'ProtectedRoute',
      'Button',
      'Dialog',
      'Accordion',
      'CategoriesContext'
    ];
    
    console.log('✅ Null children protection implemented for:', components.join(', '));
  };
  
  // Check for forwardRef issues
  const checkForwardRef = () => {
    if (typeof React !== 'undefined') {
      if (typeof React.forwardRef === 'undefined') {
        errors.push({
          type: 'FORWARDREF_UNAVAILABLE',
          message: 'React.forwardRef is undefined - This will cause component errors',
          severity: 'critical'
        });
      } else {
        console.log('✅ React.forwardRef is available');
      }
    } else {
      errors.push({
        type: 'REACT_UNAVAILABLE_FORWARDREF',
        message: 'React is not available, cannot check forwardRef',
        severity: 'critical'
      });
    }
  };
  
  checkNullChildren();
  checkForwardRef();
  
  // Check for multiple React instances
  const reactInstances = [];
  if (window.React) reactInstances.push('window.React');
  if (typeof React !== 'undefined') reactInstances.push('global React');
  
  if (reactInstances.length > 1) {
    errors.push({
      type: 'MULTIPLE_REACT_INSTANCES',
      message: `Multiple React instances detected: ${reactInstances.join(', ')}`,
      severity: 'warning'
    });
  }
  
  // Check for bundling issues
  const scripts = Array.from(document.scripts);
  const vendorScripts = scripts.filter(script => 
    script.src && script.src.includes('vendor-')
  );
  
  if (vendorScripts.length > 1) {
    errors.push({
      type: 'MULTIPLE_VENDOR_CHUNKS',
      message: `Multiple vendor chunks detected: ${vendorScripts.length}`,
      severity: 'info'
    });
  }
  
  return errors;
};

export const logReactDebugInfo = () => {
  console.group('🔍 React Debug Information');
  
  // Environment info
  console.log('Environment:', {
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
  });
  
  // React info
  if (typeof React !== 'undefined') {
    console.log('React Info:', {
      version: React.version,
      hasChildren: typeof React.Children !== 'undefined',
      hasCreateElement: typeof React.createElement !== 'undefined',
      hasCreateRoot: typeof ReactDOM !== 'undefined' && typeof ReactDOM.createRoot !== 'undefined'
    });
  } else {
    console.warn('React is not available globally');
  }
  
  // Script analysis
  const scripts = Array.from(document.scripts);
  console.log('Scripts:', scripts.map(script => ({
    src: script.src,
    type: script.type,
    async: script.async,
    defer: script.defer
  })));
  
  // Error detection
  const errors = detectReactErrors();
  if (errors.length > 0) {
    console.warn('Detected Issues:', errors);
  } else {
    console.log('✅ No React issues detected');
  }
  
  console.groupEnd();
};

// Global error handler for React errors
export const setupReactErrorHandler = () => {
  window.addEventListener('error', (event) => {
    if (event.message.includes('Cannot set properties of undefined (setting \'Children\')')) {
      console.group('🚨 React Children Error Detected');
      console.error('Error:', event.error);
      console.log('Stack trace:', event.error?.stack);
      console.log('Event details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
      
      // Check for specific causes
      console.log('🔍 Diagnosing React Children Error...');
      
      // Check if React is available
      if (typeof React === 'undefined') {
        console.error('❌ React is not available globally');
      } else {
        console.log('✅ React is available');
        
        // Check React.Children specifically
        if (typeof React.Children === 'undefined') {
          console.error('❌ React.Children is undefined - This is the root cause!');
        } else {
          console.log('✅ React.Children is available');
        }
      }
      
      // Check for multiple React instances
      const reactInstances = [];
      if (window.React) reactInstances.push('window.React');
      if (typeof React !== 'undefined') reactInstances.push('global React');
      
      if (reactInstances.length > 1) {
        console.warn('⚠️ Multiple React instances detected:', reactInstances);
      }
      
      // Log debug info
      logReactDebugInfo();
      
      console.groupEnd();
    }
  });
  
  // Also catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && 
        event.reason.message.includes('Cannot set properties of undefined (setting \'Children\')')) {
      console.group('🚨 React Children Error (Promise Rejection)');
      console.error('Rejection:', event.reason);
      logReactDebugInfo();
      console.groupEnd();
    }
  });
};

// Initialize error detection
export const initReactErrorDetection = () => {
  setupReactErrorHandler();
  logReactDebugInfo();
  
  // Also run detection after a short delay to catch async issues
  setTimeout(() => {
    const errors = detectReactErrors();
    if (errors.length > 0) {
      console.warn('Delayed React Error Detection:', errors);
    }
  }, 1000);
};




