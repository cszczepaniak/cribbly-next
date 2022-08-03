export function generatePrelimGames(
  divisions: { id: string; teams: { id: string }[] }[]
) {
  return divisions.reduce((prev, div) => {
    const games = generateGames(div.teams.map((t) => t.id));
    prev.set(div.id, games);
    return prev;
  }, new Map<string, [string,string][]>);
}

function generateGames<T extends any[]>(
  arr: T
): [T[number], T[number]][] {
  if (arr.length != 4 && arr.length != 6) {
    throw new Error("must have 4 or 6 teams");
  }
  // We need to generate something like the following:

  // 0 1 2
  // 3 4 5

  // 0 2 5
  // 1 3 4

  // 0 5 4
  // 2 1 3

  // Note that the first element stays fixed, while the others rotate counterclockwise.
  // To represent the "other" elements, we need to generate the following array:
  //   [1 2 5 4 3]
  // From there, we can rotate this array to get each of the above states.

  const midpoint = arr.length / 2;
  const first = arr[0];
  let rest = [
    ...arr.slice(1, midpoint),
    ...arr.slice(arr.length / 2).reverse(),
  ];

  const games: [T, T][] = [];
  for (let i = 0; i < 3; i++) {
    const all = [first, ...rest];
    const x = all.slice(0, midpoint);
    const y = all.slice(midpoint).reverse();
    games.push(...x.map((e, i): [T, T] => [e, y[i]]));
    rest = rotate(rest);
  }

  return games;
}

function rotate(arr: any[]) {
  const first = arr.shift();
  return [...arr, first];
}
