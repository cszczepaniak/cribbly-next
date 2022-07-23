export function sortByStringFieldDefined<T extends { id: string }>(
  getID: (input: T) => string | null | undefined
) {
  return (t1: T, t2: T) => {
    if ((!getID(t1) && !getID(t2)) || (getID(t1) && getID(t2))) {
      // If both have an ID or neither have an ID, sort by the secondary
      return t1.id.localeCompare(t2.id);
    }
    // Now it's one or the other; put the one without an ID at the top
    return getID(t1) ? 1 : -1;
  };
}
