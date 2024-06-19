import uFuzzy from '@leeoniya/ufuzzy';

const uf = new uFuzzy({
  intraMode: 1
});

export function fuzzySearch(haystack: string[], needle: string) {
  const [, info, order] = uf.search(haystack, needle);
  return order?.map((o) => haystack[info.idx[o]]) ?? [];
}