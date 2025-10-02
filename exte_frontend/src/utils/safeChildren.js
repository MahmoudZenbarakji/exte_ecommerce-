// Safe Children Utility
// This utility helps prevent React Children errors by safely handling null/undefined children

/**
 * Safely renders children, preventing React Children errors
 * @param {React.ReactNode} children - The children to render
 * @returns {React.ReactNode} - Safe children or null
 */
export const safeChildren = (children) => {
  // Handle null, undefined, or empty children
  if (children === null || children === undefined) {
    return null;
  }
  
  // Handle empty arrays
  if (Array.isArray(children) && children.length === 0) {
    return null;
  }
  
  // Handle arrays with only null/undefined values
  if (Array.isArray(children)) {
    const validChildren = children.filter(child => 
      child !== null && child !== undefined
    );
    return validChildren.length > 0 ? validChildren : null;
  }
  
  return children;
};

/**
 * Higher-order component that wraps children with safe rendering
 * @param {React.ComponentType} Component - The component to wrap
 * @returns {React.ComponentType} - Wrapped component with safe children
 */
export const withSafeChildren = (Component) => {
  return (props) => {
    const { children, ...otherProps } = props;
    return <Component {...otherProps}>{safeChildren(children)}</Component>;
  };
};

/**
 * React hook for safely handling children in functional components
 * @param {React.ReactNode} children - The children to process
 * @returns {React.ReactNode} - Safe children
 */
export const useSafeChildren = (children) => {
  return safeChildren(children);
};

// Default export for easy importing
export default safeChildren;


