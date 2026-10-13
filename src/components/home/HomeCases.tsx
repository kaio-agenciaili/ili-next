import { CasesSection } from "@/components/cases/CasesSection";
import { getHomeCases } from "@/lib/cms/wordpress";

export async function HomeCases() {
  const cases = await getHomeCases();
  return <CasesSection cases={cases} />;
}
