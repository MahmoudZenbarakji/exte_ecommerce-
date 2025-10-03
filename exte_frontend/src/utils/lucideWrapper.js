import React from 'react';

// Create a safe forwardRef wrapper that handles production builds
export const safeForwardRef = (Component) => {
  return React.forwardRef((props, ref) => {
    return <Component {...props} ref={ref} />;
  });
};

// Alternative: Create a wrapper for Lucide icons that doesn't rely on forwardRef
export const createSafeIcon = (IconComponent) => {
  return React.memo((props) => {
    const { ref, ...restProps } = props;
    return <IconComponent {...restProps} />;
  });
};
