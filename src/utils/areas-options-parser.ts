import type { TArea } from "./validators";

export function areasOptionsParser(areas: TArea[] | undefined) {
  if (!areas) return {};
  const obj: Record<string, string> = {};

  for (const item of areas) {
    obj[item._id] = item.label;
  }

  return obj;
}
