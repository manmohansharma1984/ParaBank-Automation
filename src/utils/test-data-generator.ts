// Generate random 5-digit number for unique usernames
// Use random generation instead of sequential counters to avoid
// collisions in shared test environments and support parallel test execution.
function generateRandom5Digit(): number {
  return Math.floor(10000 + Math.random() * 90000); // 10000-99999
}

/**
 * Generates test user registration data with unique usernames.
 *
 * Use fixed data for most fields since ParaBank validates them,
 * but randomized usernames to avoid collisions in shared environments.
 */
export function generateUserRegistrationData(): {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ssn: string;
  username: string;
  password: string;
  confirmPassword: string;
} {
  const username = `manmohan${generateRandom5Digit()}`;

  return {
    firstName: 'TestUserManmohan',
    lastName: 'Automation',
    address: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    zipCode: '12345',
    phone: '1234567890',
    ssn: '123-45-6789',
    username: username, // manmohan + random 5-digit number
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
  };
}

export function generateRandomAmount(min: number = 10, max: number = 1000): string {
  return (Math.random() * (max - min) + min).toFixed(2);
}

export function generateBillPaymentData(): {
  payeeName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  accountNumber: string;
  verifyAccount: string;
  amount: string;
} {
  return {
    payeeName: `Payee_${Math.floor(Math.random() * 1000)}`,
    address: `${Math.floor(Math.random() * 9999)} Hawa Mahal Road`,
    city: 'Jaipur',
    state: 'Rajasthan',
    zipCode: '302017',
    phone: `911${Math.floor(Math.random() * 10000)}`.padStart(10, '0'),
    accountNumber: Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, '0'),
    verifyAccount: '',
    amount: generateRandomAmount(50, 500),
  };
}
