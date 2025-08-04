export const welcomeStrings = {
  // Welcome screen texts
  welcomeTitle: 'Welcome to Coordle!',
  welcomeSubtitle: 'Sign in to continue.',

  // Sign-in button texts
  signInWithGoogle: 'Sign in with Google',
  signInWithApple: 'Sign in with Apple',

  // Separator text
  separatorText: 'Or sign in with',

  // Email/Phone input
  emailPhoneLabel: 'Email address or Phone number*',
  emailPhonePlaceholder: 'Enter your email address',
  orText: 'Or',
  phoneNumberLabel: 'Phone Number',
  phoneNumberPlaceholder: 'Phone Number',

  // Checkbox agreement
  agreementText:
    'I agree to receive verified third party SMS in my phone number',

  // Console log messages
  googleSignInPressed: 'Google sign in pressed',
  appleSignInPressed: 'Apple sign in pressed',
} as const;

export type WelcomeStrings = typeof welcomeStrings;
