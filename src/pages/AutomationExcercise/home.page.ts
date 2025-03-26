// src/pages/home.page.ts
import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { logger } from '../../utils/logger';
//import { BasePage } from './base.page';
//import { logger } from '../utils/logger';

export class HomePage extends BasePage {
  // Selectors for Automation Exercise website
  readonly selectors = {
    homeLink: 'a[href="/"]',
    productsLink: 'a[href="/products"]',
    cartLink: 'a[href="/view_cart"]',
    loginSignupLink: 'a[href="/login"]',
    contactUsLink: 'a[href="/contact_us"]',
    testCasesLink: 'a[href="/test_cases"]',
    loggedInAsText: 'a:has-text("Logged in as")',
    logoutLink: 'a[href="/logout"]',
    deleteAccountLink: 'a[href="/delete_account"]',
    featuredItems: '.features_items',
    featuredItemsTitle: '.features_items h2.title',
    productCards: '.features_items .product-image-wrapper',
    productName: (index: number) => `.features_items .product-image-wrapper:nth-child(${index + 1}) .productinfo h2`,
    productPrice: (index: number) => `.features_items .product-image-wrapper:nth-child(${index + 1}) .productinfo p`,
    viewProductButton: (index: number) => `.features_items .product-image-wrapper:nth-child(${index + 1}) .choose a`,
    addToCartButton: (index: number) => `.features_items .product-image-wrapper:nth-child(${index + 1}) .productinfo .btn`,
    continueShoppingButton: '.modal-footer .btn-success',
    viewCartButton: '.modal-footer .btn-primary',
    searchInput: '#search_product',
    searchButton: '#submit_search',
    subscriptionEmail: '#susbscribe_email',
    subscribeButton: '#subscribe',
    categories: '.left-sidebar h2',
    categoryLink: (categoryName: string) => `a:has-text("${categoryName}")`,
    brands: '.brands_products h2',
    brandLink: (brandName: string) => `.brands-name ul li a:has-text("${brandName}")`,
    carousel: '#slider-carousel',
    carouselCaption: '.carousel-caption h2',
    footer: 'footer',
    footerText: 'footer .pull-left p',
  };

  constructor(page: Page) {
    super(page);
  }

  async navigateToHome(): Promise<void> {
    logger.info('Navigating to Automation Exercise home page');
    await this.page.goto('https://automationexercise.com/');
    await this.waitForPageLoad();
  }

  async clickOnProducts(): Promise<void> {
    logger.info('Clicking on Products link');
    await this.clickAndWait(this.selectors.productsLink);
  }

  async clickOnCart(): Promise<void> {
    logger.info('Clicking on Cart link');
    await this.clickAndWait(this.selectors.cartLink);
  }

  async clickOnLoginSignup(): Promise<void> {
    logger.info('Clicking on Login/Signup link');
    await this.clickAndWait(this.selectors.loginSignupLink);
  }

  async searchProduct(searchTerm: string): Promise<void> {
    logger.info(`Searching for product: ${searchTerm}`);
    await this.page.fill(this.selectors.searchInput, searchTerm);
    await this.clickAndWait(this.selectors.searchButton);
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.loggedInAsText);
  }

  async getLoggedInUsername(): Promise<string> {
    if (await this.isUserLoggedIn()) {
      const text = await this.getText(this.selectors.loggedInAsText);
      const match = text.match(/Logged in as ([^)]+)/);
      return match ? match[1].trim() : '';
    }
    return '';
  }

  async logout(): Promise<void> {
    logger.info('Logging out');
    await this.clickAndWait(this.selectors.logoutLink);
  }

  async getProductCount(): Promise<number> {
    return await this.page.locator(this.selectors.productCards).count();
  }

  async getProductName(index: number): Promise<string> {
    return await this.getText(this.selectors.productName(index));
  }

  async getProductPrice(index: number): Promise<string> {
    return await this.getText(this.selectors.productPrice(index));
  }

  async viewProduct(index: number): Promise<void> {
    logger.info(`Viewing product at index ${index}`);
    await this.clickAndWait(this.selectors.viewProductButton(index));
  }

  async addProductToCart(index: number): Promise<void> {
    logger.info(`Adding product at index ${index} to cart`);
    // Hover over the product to make the button visible
    await this.page.hover(this.selectors.productCards + `:nth-child(${index + 1})`);
    await this.page.click(this.selectors.addToCartButton(index));
    
    // Wait for the modal to appear
    await this.page.waitForSelector('.modal-content', { state: 'visible' });
  }

  async continueShopping(): Promise<void> {
    logger.info('Clicking Continue Shopping button');
    await this.page.click(this.selectors.continueShoppingButton);
  }

  async viewCart(): Promise<void> {
    logger.info('Clicking View Cart button');
    await this.clickAndWait(this.selectors.viewCartButton);
  }

  async clickOnCategory(categoryName: string): Promise<void> {
    logger.info(`Clicking on category: ${categoryName}`);
    // Expand the Women category if necessary (it's typically collapsed)
    if (categoryName.includes('Women') || categoryName.includes('Men') || categoryName.includes('Kids')) {
      const parentCategory = categoryName.split(' ')[0]; // Gets "Women", "Men", or "Kids"
      await this.page.click(`a[href="#${parentCategory}"]`);
      await this.page.waitForTimeout(500); // Wait for animation
    }
    await this.clickAndWait(this.selectors.categoryLink(categoryName));
  }

  async clickOnBrand(brandName: string): Promise<void> {
    logger.info(`Clicking on brand: ${brandName}`);
    await this.clickAndWait(this.selectors.brandLink(brandName));
  }

  async subscribeToNewsletter(email: string): Promise<void> {
    logger.info(`Subscribing to newsletter with email: ${email}`);
    await this.page.fill(this.selectors.subscriptionEmail, email);
    await this.page.click(this.selectors.subscribeButton);
    
    // Wait for success message
    await this.page.waitForSelector('.alert-success', { state: 'visible' });
  }

  async isSubscriptionSuccessful(): Promise<boolean> {
    return await this.isElementVisible('.alert-success');
  }

  async scrollToFooter(): Promise<void> {
    logger.info('Scrolling to footer');
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }
}