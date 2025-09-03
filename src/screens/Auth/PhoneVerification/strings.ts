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

  // Toast messages
  incompleteCodeTitle: 'Error',
  incompleteCodeMessage: 'Please enter the complete 6-digit verification code',
  verificationSuccessTitle: 'Success',
  verificationSuccessMessage:
    'Phone verified successfully! Please complete your profile.',
  loginSuccessMessage: 'Phone verified successfully! Please login.',
  verificationErrorTitle: 'Error',
  verificationErrorMessage:
    'Verification failed. Please check your code and try again.',
  resendSuccessTitle: 'Code Sent',
  resendSuccessMessage: 'Verification code has been resent to your phone.',
  resendErrorTitle: 'Resend Failed',
  resendErrorMessage: 'Failed to resend verification code. Please try again.',
} as const;

export type PhoneVerificationStrings = typeof phoneVerificationStrings;
