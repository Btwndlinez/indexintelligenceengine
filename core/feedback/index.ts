export { saveVote, upsertCompanyProfile, getCompanyProfile, getVerticalStats, getRecentVotes, getBlacklistedVerticalCompanies } from './storage';
export type { TrustFactors, FeedbackImpact } from './trust';
export { computeTrustFactors, calculateWeightedImpact, determineConfidenceLevel, getFeedbackAdjustment } from './trust';
