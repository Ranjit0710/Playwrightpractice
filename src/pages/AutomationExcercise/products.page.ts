// src/pages/products.page.ts
import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { logger } from '../../utils/logger';
//import { BasePage } from './base.page';
//import { logger } from '../utils/logger';

export class ProductsPage extends BasePage {
  // Selectors for Automation Exercise website
  readonly selectors = {
    productsTitle: '.title.text-center',
    searchInput: '#search_product',
    searchButton: '#submit_search',
    searchedProductsTitle: '.features_items .title.text-center',
    productCards: '.features_items .product-image-wrapper',
    productName: (index: number) => `.product-image-wrapper:nth-child(${index + 1}) .productinfo h2`,
    productPrice: (index: number) => `.product-image-wrapper:nth-child(${index + 1}) .productinfo p`,
    viewProductButton: (index: number) => `.product-image-wrapper:nth-child(${index + 1}) .choose a`,
    addToCartButton: (index: number) => `.product-image-wrapper:nth-child(${index + 1}) .add-to-cart`,
    viewCartButton: '.modal-footer .btn-primary',
    continueShoppingButton: '.modal-footer .btn-success',
    firstProductViewButton: '.choose a',
    brands: '.brands-name',
    brandLinks: '.brands-name ul li a',
    categories: '.category-products',
    categoryLinks: '.panel-body ul li a',
    // Product detail page selectors
    productDetailName: '.product-information h2',
    productDetailCategory: '.product-information p:nth-child(3)',
    productDetailPrice: '.product-information span span',
    productDetailAvailability: '.product-information p:nth-child(5)',
    productDetailCondition: '.product-information p:nth-child(6)',
    productDetailBrand: '.product-information p:nth-child(7)',
    quantityInput: '#quantity',
    addToCartDetailButton: 'button.cart',
    productDetailImages: '.view-product img',
    reviewName: '#name',
    reviewEmail: '#email',
    reviewText: '#review',
    submitReviewButton: '#button-review',
    successReviewMessage: '.alert-success span',
  };

  constructor(page: Page) {
    super(page);
  }

  async navigateToProducts(): Promise<void> {
    logger.info('Navigating to Products page');
    await this.page.goto('https://automationexercise.com/products');
    await this.waitForPageLoad();
  }

  async searchProduct(searchTerm: string): Promise<void> {
    logger.info(`Searching for product: ${searchTerm}`);
    await this.page.fill(this.selectors.searchInput, searchTerm);
    await this.clickAndWait(this.selectors.searchButton);
  }

  async getSearchResultTitle(): Promise<string> {
    return await this.getText(this.selectors.searchedProductsTitle);
  }

  async getProductCount(): Promise<number> {
    return await this.page.locator(this.selectors.productCards).count();
  }

  async getAllProductNames(): Promise<string[]> {
    const count = await this.getProductCount();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const name = await this.getText(this.selectors.productName(i));
      names.push(name);
    }
    
    return names;
  }

  async getAllProductPrices(): Promise<string[]> {
    const count = await this.getProductCount();
    const prices: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const price = await this.getText(this.selectors.productPrice(i));
      prices.push(price);
    }
    
    return prices;
  }

  async viewProduct(index: number): Promise<void> {
    logger.info(`Viewing product at index ${index}`);
    await this.clickAndWait(this.selectors.viewProductButton(index));
  }

  async addProductToCart(index: number): Promise<void> {
    logger.info(`Adding product at index ${index} to cart`);
    // Need to hover over product to make button visible
    await this.page.hover(`.product-image-wrapper:nth-child(${index + 1})`);
    await this.page.click(this.selectors.addToCartButton(index));
    
    // Wait for the modal to appear
    await this.page.waitForSelector('.modal-content', { state: 'visible' });
  }

  async viewCart(): Promise<void> {
    logger.info('Clicking View Cart button');
    await this.clickAndWait(this.selectors.viewCartButton);
  }

  async continueShopping(): Promise<void> {
    logger.info('Clicking Continue Shopping button');
    await this.page.click(this.selectors.continueShoppingButton);
  }

  async viewFirstProduct(): Promise<void> {
    logger.info('Viewing first product');
    await this.clickAndWait(this.selectors.firstProductViewButton);
  }

  async getBrands(): Promise<string[]> {
    const brandsLocator = this.page.locator(this.selectors.brandLinks);
    const count = await brandsLocator.count();
    const brands: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const brand = await brandsLocator.nth(i).textContent() || '';
      brands.push(brand.trim());
    }
    
    return brands;
  }

  async clickOnBrand(brandName: string): Promise<void> {
    logger.info(`Clicking on brand: ${brandName}`);
    await this.clickAndWait(`//a[contains(text(), "${brandName}")]`);
  }

  // Product Details Page Methods
  async getProductName(): Promise<string> {
    return await this.getText(this.selectors.productDetailName);
  }

  async getProductCategory(): Promise<string> {
    const text = await this.getText(this.selectors.productDetailCategory);
    return text.replace('Category: ', '').trim();
  }

  async getProductPrice(): Promise<string> {
    return await this.getText(this.selectors.productDetailPrice);
  }

  async getProductAvailability(): Promise<string> {
    const text = await this.getText(this.selectors.productDetailAvailability);
    return text.replace('Availability: ', '').trim();
  }

  async getProductCondition(): Promise<string> {
    const text = await this.getText(this.selectors.productDetailCondition);
    return text.replace('Condition: ', '').trim();
  }

  async getProductBrand(): Promise<string> {
    const text = await this.getText(this.selectors.productDetailBrand);
    return text.replace('Brand: ', '').trim();
  }

  async setQuantity(quantity: number): Promise<void> {
    logger.info(`Setting quantity to: ${quantity}`);
    await this.page.fill(this.selectors.quantityInput, quantity.toString());
  }

  async addToCart(): Promise<void> {
    logger.info('Adding product to cart from detail page');
    await this.page.click(this.selectors.addToCartDetailButton);
    
    // Wait for the modal to appear
    await this.page.waitForSelector('.modal-content', { state: 'visible' });
  }

  async writeReview(name: string, email: string, review: string): Promise<void> {
    logger.info(`Writing review as ${name}`);
    // Scroll to review section
    await this.page.evaluate(() => {
      document.querySelector('a[href="#reviews"]')?.scrollIntoView();
    });
    
    await this.page.fill(this.selectors.reviewName, name);
    await this.page.fill(this.selectors.reviewEmail, email);
    await this.page.fill(this.selectors.reviewText, review);
    await this.page.click(this.selectors.submitReviewButton);
  }

  async isReviewSuccessful(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.successReviewMessage);
  }
}