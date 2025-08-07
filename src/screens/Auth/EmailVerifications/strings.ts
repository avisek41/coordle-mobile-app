export const emailVerificationStrings = {
  // Header
  backButtonPressed: 'Back button pressed',

  // Main content
  title: 'Check Your Inbox',

  // Email message
  emailSentMessage: "We've sent a verification email to",
  emailAddress: 'kristinwatson@hotmail.com',

  // Instructions
  clickLinkInstruction: 'Click link in your email to verify account.',
  spamFolderInstruction: "if you can't find the email check your spam folder.",

  // Buttons
  resendEmailButton: 'Resend Email',
  continueButton: 'Continue',

  // Console log messages
  resendEmailPressed: 'Resend email pressed',
  continuePressed: 'Continue pressed',

  // Toast messages
  resendSuccessTitle: 'Success',
  resendSuccessMessage: 'Verification email has been resent successfully!',
  resendErrorTitle: 'Error',
  resendErrorMessage: 'Failed to resend verification email. Please try again.',
  emailNotVerifiedTitle: 'Email Not Verified',
  emailNotVerifiedMessage: 'Please verify your email before continuing.',
} as const;

export type EmailVerificationStrings = typeof emailVerificationStrings;
