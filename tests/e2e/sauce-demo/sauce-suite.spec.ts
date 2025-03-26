// tests/e2e/sauce-demo/sauce-suite.spec.ts
import { test } from '@playwright/test';
import { logger } from '../../../src/utils/logger';

test.describe.serial('Sauce Demo E2E Test Suite', () => {
  test('Suite Setup', async () => {
    logger.info('Starting Sauce Demo test suite');
  });
  
  // This ensures tests run in the following order
  test.describe('Login Tests', async () => {
    require('./sauce.logintest.spec.ts');
  });
  
  test.describe('Product Sort Tests', async () => {
    require('./sauce.productsort.spec.ts');
  });
  
  test.describe('Cart Tests', async () => {
    require('./sauce.cart.spec.ts');
  });
  
  test.describe('Checkout Flow Tests', async () => {
    require('./sauce.checkout-flow.spec.ts');
  });
  
  test('Suite Teardown', async () => {
    logger.info('Sauce Demo test suite completed');
  });
});