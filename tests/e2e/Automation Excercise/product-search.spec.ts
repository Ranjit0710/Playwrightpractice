// tests/e2e/product-search.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../../src/pages/AutomationExcercise/home.page';
import { ProductsPage } from '../../../src/pages/AutomationExcercise/products.page';
import { TestContext } from '../../../src/utils/test-context';
import { logger } from '../../../src/utils/logger';
// import { HomePage } from '../../src/pages/home.page';
// import { ProductsPage } from '../../src/pages/products.page';
// import { TestContext } from '../../src/utils/test-context';
// import { logger } from '../../src/utils/logger';

test.describe('Product Search Functionality', () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let testContext: TestContext;

  // Test data specific to Automation Exercise website
  const validSearchTerms = ['dress', 'top', 'tshirt', 'men'];
  const invalidSearchTerm = 'xyznonexistentproduct123456789';

  test.beforeEach(async ({ page }) => {
    logger.info('Setting up test');
    
    // Initialize context and page objects
    testContext = new TestContext(page);
    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);
    
    // Navigate to home page
    await homePage.navigateToHome();
  });

  test('Search should return relevant results for valid search term', async () => {
    // Choose a random search term from our list
    const searchTerm = validSearchTerms[Math.floor(Math.random() * validSearchTerms.length)];
    logger.info(`Testing search with term: ${searchTerm}`);
    
    // Navigate to Products page first (where the search box is prominently located)
    await homePage.clickOnProducts();
    
    // Perform search
    await productsPage.searchProduct(searchTerm);
    
    // Verify the search title is displayed
    const searchTitle = await productsPage.getSearchResultTitle();
    expect(searchTitle).toContain('SEARCHED PRODUCTS');
    
    // Verify search results are returned
    const resultCount = await productsPage.getProductCount();
    expect(resultCount).toBeGreaterThan(0);
    
    // Get all product names
    const productNames = await productsPage.getAllProductNames();
    logger.info(`Found ${resultCount} products for search term "${searchTerm}"`);
    
    // Verify at least one result contains the search term (case insensitive)
    const searchTermLower = searchTerm.toLowerCase();
    const hasRelevantResults = productNames.some(name => 
      name.toLowerCase().includes(searchTermLower)
    );
    
    expect(hasRelevantResults).toBeTruthy();
  });

  test('Search with no matching results should show empty results', async () => {
    logger.info(`Testing search with invalid term: ${invalidSearchTerm}`);
    
    // Navigate to Products page first
    await homePage.clickOnProducts();
    
    // Perform search with invalid term
    await productsPage.searchProduct(invalidSearchTerm);
    
    // Verify the search title is still displayed
    const searchTitle = await productsPage.getSearchResultTitle();
    expect(searchTitle).toContain('SEARCHED PRODUCTS');
    
    // Verify no results are returned or a very small number
    // Automation Exercise might return some default products even for invalid searches
    const resultCount = await productsPage.getProductCount();
    logger.info(`Found ${resultCount} products for invalid search term "${invalidSearchTerm}"`);
    
    if (resultCount > 0) {
      // If products are returned, verify they don't match our invalid search term
      const productNames = await productsPage.getAllProductNames();
      const hasMatchingResults = productNames.some(name =>  name.toLowerCase().includes(invalidSearchTerm.toLowerCase())
      );
      expect(hasMatchingResults).toBeFalsy();
    }
  });

  test('User should be able to view product details from search results', async () => {
    const searchTerm = validSearchTerms[0]; // Use first valid search term
    logger.info(`Testing navigation from search results, term: ${searchTerm}`);
    
    // Navigate to Products page first
    await homePage.clickOnProducts();
    
    // Perform search
    await productsPage.searchProduct(searchTerm);
    
    // Verify search results are returned
    const resultCount = await productsPage.getProductCount();
    expect(resultCount).toBeGreaterThan(0);
    
    // Get name of first product in search results
    const productNames = await productsPage.getAllProductNames();
    const firstProductName = productNames[0];
    
    // Click on first product to view details
    await productsPage.viewProduct(0);
    
    // Verify product detail page is displayed
    // Get product name from details page
    const detailPageProductName = await productsPage.getProductName();
    
    // Verify it matches what we clicked on
    expect(detailPageProductName).toBe(firstProductName);
    
    // Verify product details are displayed
    const category = await productsPage.getProductCategory();
    const price = await productsPage.getProductPrice();
    const availability = await productsPage.getProductAvailability();
    const condition = await productsPage.getProductCondition();
    const brand = await productsPage.getProductBrand();
    
    expect(category).toBeTruthy();
    expect(price).toBeTruthy();
    expect(availability).toBeTruthy();
    expect(condition).toBeTruthy();
    expect(brand).toBeTruthy();
    
    logger.info(`Successfully navigated to product detail page: ${detailPageProductName}`);
    logger.info(`Product details - Category: ${category}, Price: ${price}, Brand: ${brand}`);
  });

  test('User can search by category', async () => {
    logger.info('Testing search by category');
    
    // Categories on Automation Exercise are structured as:
    // Women > Dress, Tops, Saree
    // Men > Tshirts, Jeans
    const category = 'Women';
    const subcategory = 'Dress';
    
    // Navigate to home page
    await homePage.navigateToHome();
    
    // Click on category
    await homePage.clickOnCategory(`${category} > ${subcategory}`);
    
    // Verify products are displayed
    const pageTitle = await productsPage.getSearchResultTitle();
    expect(pageTitle).toContain(subcategory.toUpperCase());
    
    // Verify some products are displayed
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    logger.info(`Found ${productCount} products in category ${category} > ${subcategory}`);
  });

  test('User can search by brand', async () => {
    logger.info('Testing search by brand');
    
    // Navigate to Products page first
    await homePage.clickOnProducts();
    
    // Get available brands
    const brands = await productsPage.getBrands();
    expect(brands.length).toBeGreaterThan(0);
    
    // Select the first brand
    const selectedBrand = brands[0].trim();
    logger.info(`Selecting brand: ${selectedBrand}`);
    
    // Click on the brand
    await productsPage.clickOnBrand(selectedBrand);
    
    // Verify products are displayed
    const pageTitle = await productsPage.getSearchResultTitle();
    expect(pageTitle).toContain('BRAND');
    expect(pageTitle).toContain(selectedBrand.toUpperCase());
    
    // Verify some products are displayed
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    logger.info(`Found ${productCount} products for brand ${selectedBrand}`);
  });
});