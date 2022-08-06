type getKeyFunc<T> = (input: T) => string | null | undefined | boolean;

export function sortFalsyFirst<T extends { id: string }>(
  getSortKey: getKeyFunc<T>,
  thenBy?: (in1: T, in2: T) => number
) {
  return (t1: T, t2: T) => {
    if (
      (!getSortKey(t1) && !getSortKey(t2)) ||
      (getSortKey(t1) && getSortKey(t2))
    ) {
      if (thenBy) {
        // If we have a custom secondary sort function, use it
        return thenBy(t1, t2);
      }
      // If both have an ID or neither have an ID, sort by the secondary
      return t1.id.localeCompare(t2.id);
    }
    // Now it's one or the other; put the one without an ID at the top
    return getSortKey(t1) ? 1 : -1;
  };
}
