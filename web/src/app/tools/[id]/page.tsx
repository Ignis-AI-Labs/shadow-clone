import { notFound } from 'next/navigation';
import { getToolById, tools } from '@/lib/prompts';
import { ToolWorkspace } from '@/components/ToolWorkspace';

export const generateStaticParams = async () =>
  tools.map((t) => ({ id: t.id }));

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = getToolById(id);
  if (!tool) return { title: 'Tool not found · Shadow Clone' };
  return {
    title: `${tool.label} · Shadow Clone`,
    description: tool.description,
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = getToolById(id);
  if (!tool) notFound();
  return <ToolWorkspace toolId={id} />;
}
