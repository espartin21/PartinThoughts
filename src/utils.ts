export function readTime(body: string | undefined): number {
  return Math.max(1, Math.ceil((body?.split(/\s+/).length ?? 0) / 250));
}
