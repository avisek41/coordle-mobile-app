export const createPasswordStrings = {
  // Header
  backButtonPressed: 'Back button pressed',

  // Main content
  title: 'Create Password',

  // Instructions
  passwordInstructions:
    'Use a minimum of 10 characters, including uppercase letters, lowercase letters and numbers.',

  // Input fields
  createPasswordLabel: 'Create password*',
  createPasswordPlaceholder: 'Enter password',
  confirmPasswordLabel: 'Confirm password*',
  confirmPasswordPlaceholder: 'Enter confirm password',

  // Terms and Privacy
  termsAgreement: 'I agree to ',
  termsOfService: 'Terms of Service',
  andText: ' and ',
  privacyPolicy: 'Privacy Policy',

  // Buttons
  continueButton: 'Continue',

  // Console log messages
  continuePressed: 'Continue pressed',
} as const;

export type CreatePasswordStrings = typeof createPasswordStrings;
