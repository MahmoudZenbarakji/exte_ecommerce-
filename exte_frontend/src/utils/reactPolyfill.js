// React polyfill for production builds
// Only import React if it's not already available globally
let React;
if (typeof window !== 'undefined' && window.React) {
  React = window.React;
} else {
  // Import React only if not available globally
  React = require('react');
}

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
  if (!React.useLayoutEffect) {
    React.useLayoutEffect = React.useEffect;
  }
  
  // Ensure all React hooks are properly exposed
  const hooks = [
    'useState', 'useEffect', 'useLayoutEffect', 'useContext', 
    'useReducer', 'useCallback', 'useMemo', 'useRef', 'useImperativeHandle'
  ];
  
  hooks.forEach(hook => {
    if (!React[hook] && React[hook.replace('use', '')]) {
      React[hook] = React[hook.replace('use', '')];
    }
  });
}

export default React;