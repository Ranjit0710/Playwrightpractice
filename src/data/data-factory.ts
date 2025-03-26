// src/data/data-factory.ts
export class UserFactory {
    static createRandomUser() {
      return {
        username: `user_${Math.random().toString(36).substring(2, 10)}`,
        email: `test_${Date.now()}@example.com`,
        password: `Pass_${Math.random().toString(36).substring(2, 10)}`,
      };
    }
    
    static createPremiumUser() {
      return {
        ...this.createRandomUser(),
        subscription: 'premium',
        paymentVerified: true,
      };
    }
  }