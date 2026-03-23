export interface SecurityQuestion {
  id: string;
  question_text: string;
  category: string;
}

export interface SecurityAnswer {
  questionId: string;
  answer: string;
}

export interface SecurityQuestionsSetup {
  questionId: string;
  answer: string;
}

export interface ForgotPINData {
  phoneNumber: string;
  answers: SecurityAnswer[];
  newPin: string;
}

export interface ForgotPINVerifyPhoneResponse {
  success: boolean;
  error: string | null;
  questions: SecurityQuestion[] | null;
  businessId: string | null;
  remainingAttempts?: number;
  lockoutTime?: number;
}

export interface ForgotPINVerifyAnswersResponse {
  success: boolean;
  error: string | null;
  resetToken: string | null;
  businessId?: string;
  remainingAttempts?: number;
  lockoutTime?: number;
}

export interface PINResetCompleteResponse {
  success: boolean;
  error?: string;
  message?: string;
}
