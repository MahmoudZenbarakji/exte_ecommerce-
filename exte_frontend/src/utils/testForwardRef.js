// Test forwardRef availability
// This utility tests if forwardRef is working properly

export const testForwardRef = () => {
  console.log('Testing forwardRef availability...');
  
  // Test 1: Check if React.forwardRef exists
  if (typeof React !== 'undefined' && React.forwardRef) {
    console.log('✅ React.forwardRef is available');
    
    // Test 2: Try to create a simple forwardRef component
    try {
      const TestComponent = React.forwardRef((props, ref) => {
        return React.createElement('div', { ref, ...props }, 'Test');
      });
      console.log('✅ forwardRef component creation successful');
      return true;
    } catch (error) {
      console.error('❌ forwardRef component creation failed:', error);
      return false;
    }
  } else {
    console.error('❌ React.forwardRef is not available');
    return false;
  }
};

// Test window.React.forwardRef
export const testWindowForwardRef = () => {
  if (typeof window !== 'undefined' && window.React && window.React.forwardRef) {
    console.log('✅ window.React.forwardRef is available');
    return true;
  } else {
    console.error('❌ window.React.forwardRef is not available');
    return false;
  }
};

// Run tests
export const runAllTests = () => {
  console.log('Running forwardRef tests...');
  const test1 = testForwardRef();
  const test2 = testWindowForwardRef();
  
  if (test1 && test2) {
    console.log('🎉 All forwardRef tests passed!');
    return true;
  } else {
    console.error('❌ Some forwardRef tests failed');
    return false;
  }
};
