import type { CriticProfile } from "@/lib/critics/types";
import type { ProjectSubmission } from "@/lib/validation/submission";
import { commonCritiqueRules } from "@/lib/ai/prompts/common-critique";
import { getSourceMetadata } from "@/lib/sources";

export function buildFirstPassPrompt({
  submission,
  critic,
}: {
  submission: ProjectSubmission;
  critic: CriticProfile;
}) {
  const outputLanguage =
    submission.language === "ko"
      ? "Write the final critique in Korean. Preserve proper names and important architectural terms in English when useful."
      : "Write the final critique in English.";

  const profile = {
    name: critic.name,
    coreBeliefs: critic.coreBeliefs,
    evaluationAxes: critic.evaluationAxes,
    criticalQuestions: critic.criticalQuestions,
    perspectiveLimitations: critic.perspectiveLimitations,
  };
  return `
${commonCritiqueRules}

Output language:
${outputLanguage}

Selected critic profile:
${JSON.stringify(profile)}

Research bibliography (metadata only; do not claim to have read full books or invent quotations/page citations):
${JSON.stringify(getSourceMetadata(critic.sourceIds).map((source) => ({ title: source.title, notes: source.notes })))}

Student project submission:
${JSON.stringify(submission)}

Tone:
- constructive: calm studio guidance
- direct: sharper and more concise
- jury: firm and consequence-focused

Requested intensity: ${submission.intensity}
Requested focus: ${submission.reviewFocus}

Return only valid JSON matching the requested schema.
Use exactly three critique points.
Use three or four questions for the designer.
Use exactly three recommendation queries.
`.trim();
}
