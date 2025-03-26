
/**
 * Utility for generating test data
 */
export class TestDataGenerator {
  /**
   * Generate a random string of specified length
   */
  static randomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
  
  /**
   * Generate a random email address
   */
  static randomEmail(domain: string = 'example.com'): string {
    const timestamp = new Date().getTime();
    const randomStr = this.randomString(6);
    return `test.${randomStr}.${timestamp}@${domain}`;
  }
  
  /**
   * Generate a random phone number
   */
  static randomPhoneNumber(): string {
    const areaCode = Math.floor(100 + Math.random() * 900);
    const prefix = Math.floor(100 + Math.random() * 900);
    const lineNumber = Math.floor(1000 + Math.random() * 9000);
    
    return `${areaCode}-${prefix}-${lineNumber}`;
  }
  
  /**
   * Generate a random name
   */
  static randomName(): { firstName: string; lastName: string } {
    const firstNames = [
      'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Emma',
      'William', 'Olivia', 'James', 'Sophia', 'Benjamin', 'Isabella', 'Daniel', 'Mia'
    ];
    
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
      'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin'
    ];
    
    return {
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)]
    };
  }
  
  /**
   * Generate a random address
   */
  static randomAddress(): {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } {
    const streets = [
      '123 Main St', '456 Oak Ave', '789 Pine Blvd', '101 Maple Dr',
      '202 Cedar Ln', '303 Elm St', '404 Birch Rd', '505 Willow Way'
    ];
    
    const cities = [
      'New York', 'Los Angeles', 'Chicago', 'Houston',
      'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'
    ];
    
    const states = [
      'NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'FL', 'OH'
    ];
    
    return {
      street: streets[Math.floor(Math.random() * streets.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      zipCode: Math.floor(10000 + Math.random() * 90000).toString(),
      country: 'United States'
    };
  }
  
  /**
   * Generate random credit card information
   */
  static randomCreditCard(): {
    cardNumber: string;
    nameOnCard: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  } {
    // Test credit card numbers by card type
    const testCardNumbers = [
      '4111111111111111', // Visa
      '5555555555554444', // Mastercard
      '378282246310005',  // American Express
      '6011111111111117'  // Discover
    ];
    
    const name = this.randomName();
    const currentYear = new Date().getFullYear();
    
    return {
      cardNumber: testCardNumbers[Math.floor(Math.random() * testCardNumbers.length)],
      nameOnCard: `${name.firstName} ${name.lastName}`,
      expiryMonth: (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0'),
      expiryYear: (currentYear + Math.floor(Math.random() * 5) + 1).toString(),
      cvv: Math.floor(100 + Math.random() * 900).toString()
    };
  }
}