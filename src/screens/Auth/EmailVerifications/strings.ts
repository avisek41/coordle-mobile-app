export const emailVerificationStrings = {
  // Header
  backButtonPressed: 'Back button pressed',

  // Main content
  title: 'Check Your Inbox',
  
  // Email message
  emailSentMessage: 'We\'ve sent a verification email to',
  emailAddress: 'kristinwatson@hotmail.com',
  
  // Instructions
  clickLinkInstruction: 'Click link in your email to verify account.',
  spamFolderInstruction: 'if you can\'t find the email check your spam folder.',
  
  // Buttons
  resendEmailButton: 'Resend Email',
  continueButton: 'Continue',
  
  // Console log messages
  resendEmailPressed: 'Resend email pressed',
  continuePressed: 'Continue pressed',
} as const;

export type EmailVerificationStrings = typeof emailVerificationStrings; 