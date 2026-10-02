const synonyms: Record<string, string[]> = {
  light: [
    "빛",
    "채광",
    "조명",
    "자연광",
    "light",
    "daylight",
    "daylit",
    "lighting",
  ],
  material: ["재료", "물성", "material", "materials"],
  atmosphere: ["분위기", "감각", "감성", "atmosphere", "sensory"],
  circulation: [
    "동선",
    "이동",
    "보행",
    "circulation",
    "movement",
    "walkable",
    "pedestrian",
    "route",
  ],
  sequence: ["순서", "시퀀스", "sequence", "sequential", "promenade", "산책"],
  structure: ["구조", "structure", "structural"],
  program: ["프로그램", "기능", "program", "programmatic"],
  public: ["공공", "공유", "public", "publicness", "civic"],
  street: ["거리", "골목", "가로", "street", "alley"],
  safety: ["안전", "safety", "safe"],
  mixed: ["복합", "혼합", "상점", "상업", "mixed", "mix", "shop"],
  urban: ["도시", "동네", "도심", "urban", "neighborhood", "downtown"],
  water: ["물의", "수공간", "빗물", "water", "rainwater"],
  bath: ["온천", "목욕", "사우나", "bath", "bathing", "spa", "thermal"],
  stone: ["석재", "돌의", "돌로", "stone"],
  concrete: ["콘크리트", "concrete"],
  wood: ["목재", "목구조", "wood", "timber"],
  room: ["열람실", "방의", "전시실", "room", "rooms", "gallery"],
  library: ["도서관", "서가", "library", "libraries"],
  museum: ["미술관", "박물관", "전시", "museum", "exhibition"],
  sacred: ["예배", "성당", "교회", "종교", "sacred", "chapel", "ritual"],
  order: ["질서", "위계", "order", "hierarchy"],
  construction: ["구축", "시공", "construction", "tectonic"],
  memory: ["기억", "역사", "memory", "history"],
  site: ["대지", "맥락", "site", "context"],
  threshold: ["문턱", "진입", "threshold", "entry", "entrance"],
  courtyard: ["중정", "courtyard", "court"],
  park: ["공원", "광장", "park", "plaza"],
  density: ["밀도", "밀집", "density", "congestion"],
  environment: ["환경", "환기", "environment", "ventilation"],
};
const stopWords = new Set([
  "the",
  "and",
  "with",
  "for",
  "from",
  "that",
  "this",
  "into",
  "its",
  "of",
  "in",
  "on",
  "to",
  "is",
  "as",
  "an",
  "by",
  "be",
  "through",
  "design",
  "project",
  "architecture",
  "architectural",
  "comprehensive",
]);

export function normalizeSearchTerms(values: string[]) {
  const text = values.join(" ").toLowerCase();
  const terms = new Set(
    text
      .split(/[^a-z0-9가-힣]+/u)
      .filter((term) => term.length >= 2 && !stopWords.has(term)),
  );
  for (const [canonical, aliases] of Object.entries(synonyms)) {
    if (
      aliases.some((alias) =>
        /[가-힣]/u.test(alias)
          ? text.includes(alias)
          : new RegExp(`\\b${alias}\\b`, "u").test(text),
      )
    ) {
      terms.add(canonical);
      for (const alias of aliases) terms.delete(alias);
      terms.add(canonical);
    }
  }
  return terms;
}
