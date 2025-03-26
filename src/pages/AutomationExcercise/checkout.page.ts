// src/pages/checkout.page.ts
import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { logger } from '../../utils/logger';
//import { BasePage } from './base.page';
//import { logger } from '../utils/logger';

export class CheckoutPage extends BasePage {
  // Selectors for Automation Exercise website
  readonly selectors = {
    pageTitle: '.breadcrumbs ol li.active',
    
    // Address Details
    addressDetailsHeading: '.checkout-information h2',
    deliveryAddress: {
      name: '#address_delivery .address_firstname.address_lastname',
      company: '#address_delivery .address_address1',
      address1: '#address_delivery .address_address2',
      city: '#address_delivery .address_city',
      state: '#address_delivery .address_state_name',
      zipcode: '#address_delivery .address_postcode',
      country: '#address_delivery .address_country_name',
      phone: '#address_delivery .address_phone'
    },
    billingAddress: {
      name: '#address_invoice .address_firstname.address_lastname',
      company: '#address_invoice .address_address1',
      address1: '#address_invoice .address_address2',
      city: '#address_invoice .address_city',
      state: '#address_invoice .address_state_name',
      zipcode: '#address_invoice .address_postcode',
      country: '#address_invoice .address_country_name',
      phone: '#address_invoice .address_phone'
    },
    
    // Order Review
    orderReviewHeading: '.cart_title',
    orderItems: '#cart_info tbody tr',
    orderItemName: (index: number) => `#cart_info tbody tr:nth-child(${index + 1}) td:nth-child(2) h4`,
    orderItemQuantity: (index: number) => `#cart_info tbody tr:nth-child(${index + 1}) td:nth-child(4) button`,
    orderItemPrice: (index: number) => `#cart_info tbody tr:nth-child(${index + 1}) td:nth-child(3) p`,
    orderItemTotal: (index: number) => `#cart_info tbody tr:nth-child(${index + 1}) td:nth-child(5) p`,
    orderTotalPrice: '#cart_info tfoot tr:nth-child(1) td.cart_total p.cart_total_price',
    
    // Comment Section
    commentArea: 'textarea[name="message"]',
    
    // Payment Section
    nameOnCard: 'input[name="name_on_card"]',
    cardNumber: 'input[name="card_number"]',
    cvc: 'input[name="cvc"]',
    expiryMonth: 'input[name="expiry_month"]',
    expiryYear: 'input[name="expiry_year"]',
    payButton: '#submit',
    
    // Place Order Button
    placeOrderButton: '.check_out',
    
    // Success Page
    successMessage: '.title.text-center',
    downloadInvoiceButton: '.btn.btn-default.check_out',
    continueButton: '.btn.btn-primary'
  };

  constructor(page: Page) {
    super(page);
  }

  async navigateToCheckout(): Promise<void> {
    logger.info('Navigating to Checkout page');
    await this.page.goto('https://automationexercise.com/checkout');
    await this.waitForPageLoad();
  }

  async getDeliveryAddress(): Promise<{
    name: string;
    company: string;
    address1: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    phone: string;
  }> {
    logger.info('Getting delivery address details');
    
    return {
      name: await this.getText(this.selectors.deliveryAddress.name),
      company: await this.getText(this.selectors.deliveryAddress.company),
      address1: await this.getText(this.selectors.deliveryAddress.address1),
      city: await this.getText(this.selectors.deliveryAddress.city),
      state: await this.getText(this.selectors.deliveryAddress.state),
      zipcode: await this.getText(this.selectors.deliveryAddress.zipcode),
      country: await this.getText(this.selectors.deliveryAddress.country),
      phone: await this.getText(this.selectors.deliveryAddress.phone)
    };
  }

  async getBillingAddress(): Promise<{
    name: string;
    company: string;
    address1: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    phone: string;
  }> {
    logger.info('Getting billing address details');
    
    return {
      name: await this.getText(this.selectors.billingAddress.name),
      company: await this.getText(this.selectors.billingAddress.company),
      address1: await this.getText(this.selectors.billingAddress.address1),
      city: await this.getText(this.selectors.billingAddress.city),
      state: await this.getText(this.selectors.billingAddress.state),
      zipcode: await this.getText(this.selectors.billingAddress.zipcode),
      country: await this.getText(this.selectors.billingAddress.country),
      phone: await this.getText(this.selectors.billingAddress.phone)
    };
  }

  async getOrderItemsCount(): Promise<number> {
    return await this.page.locator(this.selectors.orderItems).count();
  }

  async getOrderItemDetails(): Promise<Array<{name: string, quantity: number, price: string, total: string}>> {
    const itemCount = await this.getOrderItemsCount();
    const items = [];
    
    for (let i = 0; i < itemCount; i++) {
      const name = await this.getText(this.selectors.orderItemName(i));
      const quantityText = await this.getText(this.selectors.orderItemQuantity(i));
      const quantity = parseInt(quantityText);
      const price = await this.getText(this.selectors.orderItemPrice(i));
      const total = await this.getText(this.selectors.orderItemTotal(i));
      
      items.push({ name, quantity, price, total });
    }
    
    return items;
  }

  async getOrderTotal(): Promise<string> {
    return await this.getText(this.selectors.orderTotalPrice);
  }

  async addComment(comment: string): Promise<void> {
    logger.info(`Adding comment: ${comment}`);
    await this.page.fill(this.selectors.commentArea, comment);
  }

  async placeOrder(): Promise<void> {
    logger.info('Placing order');
    await this.clickAndWait(this.selectors.placeOrderButton);
  }

  async fillPaymentDetails(details: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }): Promise<void> {
    logger.info('Filling payment details');
    
    await this.page.fill(this.selectors.nameOnCard, details.nameOnCard);
    await this.page.fill(this.selectors.cardNumber, details.cardNumber);
    await this.page.fill(this.selectors.cvc, details.cvc);
    await this.page.fill(this.selectors.expiryMonth, details.expiryMonth);
    await this.page.fill(this.selectors.expiryYear, details.expiryYear);
  }

  async confirmPayment(): Promise<void> {
    logger.info('Confirming payment');
    await this.clickAndWait(this.selectors.payButton);
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.selectors.successMessage);
  }

  async downloadInvoice(): Promise<void> {
    logger.info('Downloading invoice');
    
    // This will trigger a download, need to handle download in the test
    const downloadPromise = this.page.waitForEvent('download');
    await this.page.click(this.selectors.downloadInvoiceButton);
    await downloadPromise;
  }

  async continueShopping(): Promise<void> {
    logger.info('Continuing shopping after order');
    await this.clickAndWait(this.selectors.continueButton);
  }
}