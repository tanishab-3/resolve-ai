import { supabase } from "./supabase";

// Daily limits per user. Change the numbers here.
export const DAILY_LIMITS = {
  complaint: 15, // new complaints analysed by AI
  suggestion: 40, // policy assistant suggestions
  policy: 5, // policy documents added (each one is embedded)
};

export const LIMIT_MESSAGES = {
  complaint:
    "You have reached today's limit for submitting complaints. Please try again tomorrow.",
  suggestion:
    "You have reached today's limit for policy suggestions. Please try again tomorrow.",
  policy:
    "You have reached today's limit for adding policy documents. Please try again tomorrow.",
};

// Returns true if the user may continue, false if the daily limit is reached.
export async function consumeQuota(userId, kind) {
  const { data, error } = await supabase.rpc("consume_ai_quota", {
    p_user: userId,
    p_kind: kind,
    p_limit: DAILY_LIMITS[kind],
  });

  if (error) {
    console.error("Quota check failed:", error.message);
    return false; // if the check itself breaks, we block rather than allow unlimited use
  }
  return data === true;
}