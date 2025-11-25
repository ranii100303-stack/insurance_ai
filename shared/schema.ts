import { z } from "zod";

export const claimStatusEnum = z.enum(["Pending", "Processing", "Closed", "Overridden"]);

export const claimSchema = z.object({
  id: z.string(),
  claimantName: z.string(),
  summary: z.string(),
  reportedAmount: z.number(),
  status: claimStatusEnum,
  submittedDate: z.string(),
  claimantEmail: z.string(),
  claimantPhone: z.string(),
  policyNumber: z.string(),
  vehicleInfo: z.string(),
  assessmentResults: z.object({
    recommendedPayout: z.number(),
    confidence: z.number(),
    fraudScore: z.number(),
    suggestedPath: z.enum(["Repair", "Total Loss"]),
  }).optional(),
});

export type Claim = z.infer<typeof claimSchema>;
export type ClaimStatus = z.infer<typeof claimStatusEnum>;

export const agentMessageSchema = z.object({
  agent: z.string(),
  message: z.string(),
  icon: z.string(),
});

export type AgentMessage = z.infer<typeof agentMessageSchema>;
