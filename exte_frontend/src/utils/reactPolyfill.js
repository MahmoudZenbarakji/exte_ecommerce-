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
  
  // Ensure React hooks are available
  if (!React.useLayoutEffect && React.useEffect) {
    React.useLayoutEffect = React.useEffect;
  }
  
  // Ensure all React hooks are properly exposed
  const hooks = [
    'useState', 'useEffect', 'useLayoutEffect', 'useContext', 
    'useReducer', 'useCallback', 'useMemo', 'useRef', 'useImperativeHandle'
  ];
  
  hooks.forEach(hook => {
    // Only polyfill if the hook doesn't exist and the base hook exists
    if (!React[hook]) {
      const baseHook = hook.replace('use', '');
      if (React[baseHook]) {
        React[hook] = React[baseHook];
      }
    }
  });
}

export default React;