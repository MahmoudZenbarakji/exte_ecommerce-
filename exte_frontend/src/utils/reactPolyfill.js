// React polyfill for production builds
// Import React - this will be available after main.jsx imports it
import React from 'react';

// Ensure forwardRef is available globally for Lucide React
if (typeof window !== 'undefined') {
  window.React = React;
  
  // Polyfill forwardRef if it's not available
  if (!React.forwardRef) {
    React.forwardRef = (Component) => {
      return (props, ref) => {
        return React.createElement(Component, { ...props, ref });
      };
    };
  }
  
  // Safe hook polyfill - only run after React is fully loaded
  const safePolyfillHooks = () => {
    try {
      // Ensure React hooks are available - use safer approach
      if (React && React.useEffect && !React.useLayoutEffect) {
        React.useLayoutEffect = React.useEffect;
      }
      
      // Ensure all React hooks are properly exposed - with error handling
      const hooks = [
        'useState', 'useEffect', 'useLayoutEffect', 'useContext', 
        'useReducer', 'useCallback', 'useMemo', 'useRef', 'useImperativeHandle'
      ];
      
      hooks.forEach(hook => {
        try {
          // Only polyfill if the hook doesn't exist and the base hook exists
          if (React && !React[hook]) {
            const baseHook = hook.replace('use', '');
            if (React[baseHook]) {
              React[hook] = React[baseHook];
            }
          }
        } catch (error) {
          console.warn(`Failed to polyfill ${hook}:`, error);
        }
      });
    } catch (error) {
      console.warn('Failed to polyfill React hooks:', error);
    }
  };
  
  // Run polyfill after a short delay to ensure React is fully initialized
  setTimeout(safePolyfillHooks, 0);
}

export default React;