export type SkillSuggestion = {
    skillID: string;
    canonicalName: string;
    matchedBy: "skill" | "alias" | "contains";
    confidence: number;
};

export type CandidateDecisionInput = {
    candidateID: string;
    decision: "accepted" | "rejected" | "ignored";
};
