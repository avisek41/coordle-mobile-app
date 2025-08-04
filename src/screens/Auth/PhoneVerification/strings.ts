export const phoneVerificationStrings = {
  // Header
  backButtonPressed: 'Back button pressed',

  // Main content
  title: 'Phone Verification',

  // Instructions
  instructions: 'Please enter the verification code sent to',

  // Phone Number
  phoneNumberLabel: 'Phone Number',
  phoneNumber: '+1 (239) 555-0108',

  // Verification Code
  verificationCodeLabel: 'Verification Code*',
  verificationCodePlaceholder: 'Enter verification code',

  // Resend Code
  didntGetCode: "Didn't get a code? ",
  resendCode: 'Resend',

  // Terms and Privacy
  termsAgreement: 'I agree to ',
  termsOfService: 'Terms of Service',
  andText: ' and ',
  privacyPolicy: 'Privacy Policy',

  // Buttons
  continueButton: 'Verify Code',

  // Console log messages
  continuePressed: 'Continue pressed',
  resendCodePressed: 'Resend code pressed',
} as const;

export type PhoneVerificationStrings = typeof phoneVerificationStrings; 