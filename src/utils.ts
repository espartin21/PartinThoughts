export function readTime(body: string | undefined): number {
  return Math.max(1, Math.ceil((body?.split(/\s+/).length ?? 0) / 250));
}

export function age(birthDate: Date): number {
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    years--;
  }
  return years;
}
