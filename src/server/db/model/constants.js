export const MODEL_KEY = {
  User: 'User',
  Post: 'Post',
  ReportedPost: 'ReportedPost',
  Friends: 'Friends',
  Message: 'Message',
  Conversation: 'Conversation',
  VerificationCode: 'VerificationCode'
}

export const REPORTS_REASONS = {
  SPAM: 'Spam',
  INAPPROPRIATE_CONTENT: 'Inappropriate content',
  OFFENSIVE_LANGUAGE: 'Offensive language',
  COPYRIGHT_VIOLATION: 'Copyright violation',
  FALSE_INFORMATION: 'False information',
  PERSONAL_ATTACK: 'Personal attack',
  OTHER: 'Other reason (please specify)'
}

export const REPORTS_KEYS = Object.keys(REPORTS_REASONS)
