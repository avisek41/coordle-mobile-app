export const accountCreatedStrings = {
  // Header
  backButtonPressed: 'Back button pressed',

  // Main content
  title: 'You\'re all set!',
  message: 'Account created successfully.',
  
  // Buttons
  backToSignInButton: 'Back to Sign in',
  
  // Console log messages
  backToSignInPressed: 'Back to sign in pressed',
} as const;

export type AccountCreatedStrings = typeof accountCreatedStrings; 