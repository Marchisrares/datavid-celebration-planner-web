export interface AiMessageRequest {
  memberId: number;
  tone?: 'friendly' | 'formal' | 'fun' | 'short';
  locale?: string;
  sendEmail?: boolean;
  dryRunEmail?: boolean;
}

export interface AiMessageResponse {
  message: string;
  explanation: {
    model: string;
    params: Record<string, any>;
    promptOrMethod: string;
    rationale: string;
  };
  sent?: { dryRun: boolean; provider: string };
}
