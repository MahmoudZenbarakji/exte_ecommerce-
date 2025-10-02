# 🧪 Color Features Test Suite

This document provides comprehensive testing instructions for the product color features implemented in the EXTE e-commerce application.

## 📋 Test Overview

The test suite covers:
- **Backend API Tests**: Product color endpoints, image management, and upload functionality
- **Frontend Component Tests**: Color selection UI, admin management interface
- **Integration Tests**: Complete color workflow from upload to display
- **Manual Tests**: User interface and user experience validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend server running on `http://localhost:3000`
- Frontend server running on `http://localhost:5174`
- Database (PostgreSQL) running and accessible

### Running All Tests
```bash
# From the project root directory
node test-runner.js
```

### Running Individual Test Suites

#### Backend Tests
```bash
cd backend_exte

# Run all tests
npm test

# Run color-specific tests
npm run test:color

# Run integration tests
npm run test:integration

# Run tests with coverage
npm run test:cov
```

#### Frontend Tests
```bash
cd exte_frontend

# Install test dependencies (if not already installed)
npm install

# Run all tests
npm test

# Run color-specific tests
npm run test:color

# Run tests with UI
npm run test:ui
```

#### API Tests
```bash
# From project root
node api-test.js
```

## 📁 Test Files Structure

```
├── backend_exte/
│   ├── test/
│   │   ├── products-color.test.ts          # Product color service tests
│   │   ├── upload-color.test.ts            # Upload functionality tests
│   │   └── integration-color-workflow.test.ts # End-to-end workflow tests
│   └── package.json                        # Updated with test scripts
├── exte_frontend/
│   ├── src/
│   │   ├── components/__tests__/
│   │   │   └── ProductColorSelector.test.jsx # Color selector component tests
│   │   ├── dashboard/components/__tests__/
│   │   │   └── ProductColorImageManager.test.jsx # Admin management tests
│   │   └── test/
│   │       └── setup.js                    # Test setup and mocks
│   ├── vitest.config.js                    # Vitest configuration
│   └── package.json                        # Updated with test scripts
├── test-runner.js                          # Comprehensive test runner
├── api-test.js                            # Manual API testing script
└── TEST_README.md                         # This file
```

## 🧪 Test Categories

### 1. Backend API Tests

#### Product Color Service Tests (`products-color.test.ts`)
- ✅ Get available colors from product variants and images
- ✅ Get images by specific color
- ✅ Add multiple images with color information
- ✅ Remove images by ID
- ✅ Handle edge cases (no colors, invalid colors, missing images)
- ✅ Color case sensitivity handling

#### Upload Color Tests (`upload-color.test.ts`)
- ✅ Upload multiple images with color association
- ✅ Handle upload without color specification
- ✅ Handle empty files array
- ✅ Handle upload service errors
- ✅ Complete workflow: upload images for multiple colors

#### Integration Tests (`integration-color-workflow.test.ts`)
- ✅ Complete color management workflow
- ✅ Edge cases in color workflow
- ✅ Color case sensitivity
- ✅ Performance tests with large datasets

### 2. Frontend Component Tests

#### ProductColorSelector Tests (`ProductColorSelector.test.jsx`)
- ✅ Render color selector with available colors
- ✅ Display main image for selected color
- ✅ Show image thumbnails for multiple images
- ✅ Handle color selection and image updates
- ✅ Handle image thumbnail selection
- ✅ Display color hex values correctly
- ✅ Show selected color indicator
- ✅ Handle products without color-specific images
- ✅ Handle products with only variants
- ✅ Call callbacks on mount
- ✅ Handle unknown colors gracefully

#### ProductColorImageManager Tests (`ProductColorImageManager.test.jsx`)
- ✅ Render color management interface
- ✅ Display available colors from product data
- ✅ Add new colors
- ✅ Prevent duplicate colors
- ✅ Remove colors
- ✅ Select colors and show their images
- ✅ Display images for selected color
- ✅ Show main image indicator
- ✅ Handle file upload for selected color
- ✅ Handle multiple file upload
- ✅ Remove images
- ✅ Show loading state during upload
- ✅ Handle upload errors gracefully
- ✅ Show message when no images exist

### 3. Manual Testing Guide

#### Frontend UI Tests
1. **Landing Page** (`http://localhost:5174/`)
   - [ ] Page loads without errors
   - [ ] Products display with images
   - [ ] Color selection works on product pages
   - [ ] Images change when colors are selected

2. **Admin Dashboard** (`http://localhost:5174/dashboard`)
   - [ ] Dashboard loads without errors
   - [ ] Navigate to Products → Manage
   - [ ] Color & Image Management tab is accessible
   - [ ] Add new colors (e.g., Green, Purple)
   - [ ] Upload images for different colors
   - [ ] Test image deletion and management

#### API Endpoint Tests
```bash
# Test color endpoints
curl http://localhost:3000/api/products/{id}/colors
curl http://localhost:3000/api/products/{id}/images/Red

# Test product details
curl http://localhost:3000/api/products/{id}

# Test categories
curl http://localhost:3000/api/categories
```

## 🎯 Test Scenarios

### Scenario 1: New Product with Colors
1. Create a new product in admin dashboard
2. Add color variants (Red, Blue, Green)
3. Upload images for each color
4. Test color selection on product page
5. Verify images change correctly

### Scenario 2: Existing Product Color Management
1. Select existing product in admin dashboard
2. Add new colors to existing product
3. Upload additional images
4. Test color selection with new colors
5. Remove unused colors and images

### Scenario 3: Edge Cases
1. Product with no colors
2. Product with no images
3. Invalid color names
4. Large file uploads
5. Network errors during upload

### Scenario 4: Performance Testing
1. Product with 10+ colors
2. Product with 20+ images per color
3. Test color switching performance
4. Test image loading performance

## 🐛 Common Issues and Solutions

### Backend Issues
- **Database connection errors**: Ensure PostgreSQL is running
- **Port conflicts**: Check if port 3000 is available
- **File upload errors**: Check upload directory permissions

### Frontend Issues
- **Component not rendering**: Check console for import errors
- **API calls failing**: Verify backend server is running
- **Images not loading**: Check image URLs and CORS settings

### Test Issues
- **Tests failing**: Run `npm install` to ensure dependencies are installed
- **Mock errors**: Check test setup files and mock configurations
- **Timeout errors**: Increase test timeout in configuration

## 📊 Test Coverage

The test suite aims for:
- **Backend**: 90%+ code coverage for color-related services
- **Frontend**: 85%+ component coverage for color features
- **Integration**: 100% critical path coverage

## 🔧 Test Configuration

### Backend (Jest)
- Configuration in `backend_exte/jest.config.js`
- Test database: Separate test database recommended
- Timeout: 30 seconds for integration tests

### Frontend (Vitest)
- Configuration in `exte_frontend/vitest.config.js`
- Environment: jsdom for DOM testing
- Setup: `src/test/setup.js` for global mocks

## 📈 Continuous Integration

For CI/CD pipelines, use:
```bash
# Backend tests
cd backend_exte && npm run test:cov

# Frontend tests
cd exte_frontend && npm run test:run

# API tests
node api-test.js
```

## 🎉 Success Criteria

Tests are considered successful when:
- ✅ All automated tests pass
- ✅ Manual UI tests complete without errors
- ✅ API endpoints respond correctly
- ✅ Color selection works smoothly
- ✅ Image upload and management functions properly
- ✅ No console errors in browser
- ✅ Performance is acceptable (< 2s for color switching)

## 📞 Support

If you encounter issues with the tests:
1. Check the console output for specific error messages
2. Verify all dependencies are installed
3. Ensure servers are running on correct ports
4. Check database connectivity
5. Review test configuration files

---

**Happy Testing! 🧪✨**



































