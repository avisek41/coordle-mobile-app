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
  emailPhonePlaceholder: 'Email address',
  orText: 'Or',
  phoneNumberLabel: 'Phone Number',
  phoneNumberPlaceholder: 'Phone Number',

  // Checkbox agreement
  agreementText:
    'I agree to receive verified third party SMS in my phone number',

  // Console log messages
  googleSignInPressed: 'Google sign in pressed',
  appleSignInPressed: 'Apple sign in pressed',

  // Toast messages
  emailRequired: 'Email Required',
  emailRequiredMessage: 'Please enter your email address',
  invalidEmail: 'Invalid Email',
  invalidEmailMessage: 'Please enter a valid email address',
  emailRequiredToContinue: 'Please enter your email address to continue',
  error: 'Error',
  somethingWentWrong: 'Something went wrong. Please try again.',
  userFound: 'User Found',
  welcomeBackMessage: 'Welcome back! Please proceed to sign in.',
  newUser: 'New User',
  pleaseRegisterMessage: 'Please register with this email',
  checking: 'Checking...',
  signIn: 'Sign In',
} as const;

export type WelcomeStrings = typeof welcomeStrings;
