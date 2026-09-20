import type { Language } from "@/lib/i18n";
import { referenceDatabase } from "@/lib/references/database";

const koreanReasons: Record<string, string> = {
  "therme-vals":
    "공간의 분위기를 단면, 재료, 몸의 이동 순서로 검토할 수 있습니다.\n\n이어지는 방과 묵직한 재료의 사용 방식을 살펴보세요.\n\n어둠이나 석재의 이미지만 따라 하면 구축 방식이 만드는 경험을 놓치기 쉽습니다.",
  "bruder-klaus-field-chapel":
    "시공 과정 자체가 공간과 분위기의 근거가 될 수 있음을 보여줍니다.\n\n두꺼운 외피, 압축된 입구, 하늘로 열린 내부를 살펴보세요.\n\n강렬한 재료 효과만 복제하기보다 예배 공간의 경험과 구성이 어떻게 맞물리는지 검토해야 합니다.",
  "seattle-central-library":
    "프로그램의 조직이 건물의 형태와 경험을 이끌 수 있음을 보여줍니다.\n\n서로 다른 기능의 배치와 이를 연결하는 공공 동선을 살펴보세요.\n\n복잡한 다이어그램만 따라 하기보다 실제 운영 방식이 공간 구성을 뒷받침하는지 확인해야 합니다.",
  "kunsthal-rotterdam":
    "동선이 대지와 프로그램을 연결하는 설계의 중심이 될 수 있음을 보여줍니다.\n\n램프와 교차하는 이동 경로, 단면 구성을 살펴보세요.\n\n사람들이 어디로 왜 이동하는지 분명하지 않다면 복잡한 동선은 혼란만 키울 수 있습니다.",
  "salk-institute":
    "구조와 설비, 열린 공간의 관계가 연구시설의 질서를 만드는 사례입니다.\n\n중정과 연구동, 주공간과 보조공간의 배치를 살펴보세요.\n\n운영을 받치는 공간 논리 없이 대칭적인 형태만 가져오면 형식적인 장면에 그칠 수 있습니다.",
  "kimbell-art-museum":
    "빛이 단순한 효과를 넘어 공간의 질서를 만드는 방식을 보여줍니다.\n\n반복되는 전시실과 천장 구조, 자연광을 조절하는 방식을 살펴보세요.\n\n빛의 작동 방식을 이해하지 않고 볼트 형태만 반복하면 핵심을 놓치게 됩니다.",
  "greenwich-village":
    "공공성이 실제 이용과 시간대별 활동에서 만들어지는지 살펴볼 수 있는 도시 사례입니다.\n\n짧은 블록과 다양한 용도, 활발한 가로의 관계를 관찰해보세요.\n\n밀도가 높다는 이유만으로 좋은 거리라고 판단하지는 마세요.",
  "washington-square-park":
    "열린 공간이 공공장소가 되려면 사용자와 가장자리, 일상의 리듬이 함께 작동해야 함을 보여줍니다.\n\n여러 진입로와 주변 가로, 사람들이 머무는 방식을 살펴보세요.\n\n공간이 열려 있거나 상징적이라는 이유만으로 공공성이 생기지는 않습니다.",
  "villa-savoye":
    "동선이 시간에 따라 건축적 의도를 드러내는 방식을 살펴볼 수 있습니다.\n\n필로티에서 램프를 거쳐 옥상으로 이어지는 이동을 검토해보세요.\n\n설계 목적과 무관하게 근대 건축의 요소만 차용하면 양식적인 인용에 그칠 수 있습니다.",
  ronchamp:
    "형태가 빛과 의례, 대지에서의 경험을 어떻게 만드는지 살펴볼 수 있습니다.\n\n두꺼운 벽과 개구부, 언덕 위 접근 동선을 검토해보세요.\n\n공간적 필요 없이 표현적인 형태만 따라 하면 임의적인 조형에 그칠 수 있습니다.",
};

export function getReferenceReason(title: string, originalReason: string, language: Language) {
  if (language !== "ko") return originalReason;

  const reference = referenceDatabase.find((entry) => entry.title === title);
  return reference ? koreanReasons[reference.id] ?? originalReason : originalReason;
}
