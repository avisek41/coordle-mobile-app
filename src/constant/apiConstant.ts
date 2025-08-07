export const API_ENDPOINTS = {
  CHECK_EMAIL_STATUS: '/api/users/check-email-status',
  SEND_EMAIL_VERIFICATION: '/api/verification/send-email-link',
  RESEND_EMAIL_VERIFICATION: '/api/verification/resend-email-link',
  LOGIN: '/api/users/login',
  SETUP_PROFILE: '/api/users/setup-profile',
  PROFILE_OPTIONS: '/api/profile-options',
} as const;
