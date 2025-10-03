#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running Color Feature Tests...\n');

// Test configuration
const tests = [
  {
    name: 'Backend - Product Color Features',
    command: 'npm test -- test/products-color.test.ts',
    directory: 'backend_exte',
  },
  {
    name: 'Backend - Upload Color Features',
    command: 'npm test -- test/upload-color.test.ts',
    directory: 'backend_exte',
  },
  {
    name: 'Backend - Integration Tests',
    command: 'npm test -- test/integration-color-workflow.test.ts',
    directory: 'backend_exte',
  },
  {
    name: 'Frontend - ProductColorSelector Component',
    command: 'npm test -- src/components/__tests__/ProductColorSelector.test.jsx',
    directory: 'exte_frontend',
  },
  {
    name: 'Frontend - ProductColorImageManager Component',
    command: 'npm test -- src/dashboard/components/__tests__/ProductColorImageManager.test.jsx',
    directory: 'exte_frontend',
  },
];

// Run tests
async function runTests() {
  let passedTests = 0;
  let failedTests = 0;

  for (const test of tests) {
    console.log(`\n📋 Running: ${test.name}`);
    console.log('─'.repeat(50));

    try {
      const testPath = path.join(__dirname, test.directory);
      execSync(test.command, {
        cwd: testPath,
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'test' },
      });
      console.log(`✅ ${test.name} - PASSED`);
      passedTests++;
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED`);
      console.log(`Error: ${error.message}`);
      failedTests++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Total: ${passedTests + failedTests}`);

  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! Color features are working correctly.');
  } else {
    console.log(`\n⚠️  ${failedTests} test(s) failed. Please check the output above.`);
    process.exit(1);
  }
}

// Manual test instructions
function printManualTestInstructions() {
  console.log('\n' + '='.repeat(60));
  console.log('🔧 MANUAL TESTING INSTRUCTIONS');
  console.log('='.repeat(60));
  
  console.log('\n1. 🌐 Frontend Tests:');
  console.log('   • Visit: http://localhost:5174/');
  console.log('   • Check if landing page loads with product images');
  console.log('   • Click on a product to see color selection');
  console.log('   • Test color switching and image updates');
  
  console.log('\n2. 🎛️  Admin Dashboard Tests:');
  console.log('   • Visit: http://localhost:5174/dashboard');
  console.log('   • Go to Products → Manage → Color & Image Management');
  console.log('   • Add new colors (e.g., Green, Purple)');
  console.log('   • Upload images for different colors');
  console.log('   • Test image deletion and management');
  
  console.log('\n3. 🔗 API Tests:');
  console.log('   • Test color endpoints:');
  console.log('     curl http://localhost:3000/api/products/{id}/colors');
  console.log('     curl http://localhost:3000/api/products/{id}/images/Red');
  console.log('   • Test image upload:');
  console.log('     curl -X POST http://localhost:3000/api/upload/product-images-multiple');
  
  console.log('\n4. 🎨 Color Feature Tests:');
  console.log('   • Create products with multiple colors');
  console.log('   • Upload images for each color');
  console.log('   • Test color selection on product pages');
  console.log('   • Verify images change when colors are selected');
  console.log('   • Test admin color management interface');
  
  console.log('\n5. 🐛 Edge Case Tests:');
  console.log('   • Products with no colors');
  console.log('   • Products with no images');
  console.log('   • Invalid color names');
  console.log('   • Large file uploads');
  console.log('   • Network errors during upload');
}

// Run the tests
runTests().then(() => {
  printManualTestInstructions();
}).catch((error) => {
  console.error('Test runner failed:', error);
  process.exit(1);
});



































