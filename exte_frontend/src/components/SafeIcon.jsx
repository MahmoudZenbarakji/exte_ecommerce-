import React from 'react';

// Safe wrapper for Lucide icons that handles forwardRef issues in production
const SafeIcon = React.memo(({ Icon, ...props }) => {
  if (!Icon) return null;
  
  // Create a safe component that doesn't rely on forwardRef
  const SafeIconComponent = React.useMemo(() => {
    return (iconProps) => {
      const { ref, ...restProps } = iconProps;
      return <Icon {...restProps} />;
    };
  }, [Icon]);

  return <SafeIconComponent {...props} />;
});

SafeIcon.displayName = 'SafeIcon';

export default SafeIcon;
