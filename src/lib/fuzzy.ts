import uFuzzy from '@leeoniya/ufuzzy';

const uf = new uFuzzy({
  intraMode: 1
});

export function fuzzySearch(haystack: string[], needle: string) {
  const [, info, order] = uf.search(haystack, needle);
  return order?.map((o) => haystack[info.idx[o]]) ?? [];
}

export function filterListByKey<Type, Key extends keyof Type>(haystack: Type[], key: Key, needle: string) {
  const filtered = fuzzySearch(haystack.map(x => String(x[key])), needle)
  return haystack.filter(x => filtered.includes(String(x[key])))
}
