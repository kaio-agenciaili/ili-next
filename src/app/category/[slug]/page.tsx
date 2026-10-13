import type { Metadata } from "next";
import { CategoryArchive, categoryMetadata } from "@/components/blog/CategoryArchive";
import { getCategories } from "@/lib/cms/wordpress";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return categoryMetadata(slug);
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  return <CategoryArchive slug={slug} page={1} />;
}
