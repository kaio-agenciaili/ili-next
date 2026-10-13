import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryArchive, categoryMetadata } from "@/components/blog/CategoryArchive";
import { getCategories } from "@/lib/cms/wordpress";

export async function generateStaticParams() {
  // As páginas 2+ são geradas sob demanda; o build só exige um exemplo (que vira 404 se não existir).
  const categories = await getCategories();
  return [{ slug: categories[0]?.slug ?? "sem-categoria", page: "2" }];
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]/page/[page]">): Promise<Metadata> {
  const { slug } = await params;
  return categoryMetadata(slug);
}

export default async function CategoryPagedPage({ params }: PageProps<"/category/[slug]/page/[page]">) {
  const { slug, page } = await params;
  const n = Number(page);
  // /page/1/ e números inválidos não existem (no WordPress a página 1 é a URL base).
  if (!Number.isInteger(n) || n < 2) notFound();
  return <CategoryArchive slug={slug} page={n} />;
}
