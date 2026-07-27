import { CritiqueResult } from "@/components/critique-result";

type CritiqueResultPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CritiqueResultPage({
  params,
}: CritiqueResultPageProps) {
  const { id } = await params;

  return <CritiqueResult resultId={id} />;
}
