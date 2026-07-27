import { janeJacobs } from "@/lib/critics/jane-jacobs";
import { leCorbusier } from "@/lib/critics/le-corbusier";
import { louisKahn } from "@/lib/critics/louis-kahn";
import { peterZumthor } from "@/lib/critics/peter-zumthor";
import { remKoolhaas } from "@/lib/critics/rem-koolhaas";
import type { CriticProfile } from "@/lib/critics/types";

export const criticProfiles: CriticProfile[] = [
  peterZumthor,
  remKoolhaas,
  louisKahn,
  janeJacobs,
  leCorbusier,
];

export function getCriticProfile(criticId: string) {
  return (
    criticProfiles.find(
      (critic) => critic.id === criticId || critic.slug === criticId,
    ) ?? null
  );
}

export type { CriticProfile } from "@/lib/critics/types";
