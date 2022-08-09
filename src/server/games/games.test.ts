import { generatePrelimGames } from "./games";

test("generate prelims", () => {
  const prelims = generatePrelimGames([
    {
      id: "div1",
      teams: ["d1t1", "d1t2", "d1t3", "d1t4"].map((id) => ({ id })),
    },
    {
      id: "div2",
      teams: ["d2t1", "d2t2", "d2t3", "d2t4", "d2t5", "d2t6"].map((id) => ({
        id,
      })),
    },
    {
      id: "div3",
      teams: ["d3t1", "d3t2", "d3t3", "d3t4"].map((id) => ({
        id,
      })),
    },
  ]);

  expect(prelims.size).toBe(3);

  const expectUniquePairings = (
    input: ReturnType<typeof prelims.get>,
    expNum: number
  ) => {
    expect(input).toBeDefined();
    if (!input) {
      return;
    }
    expect(input).toHaveLength(expNum);

    const pairSet = new Set(input.map((pair) => pair.sort().join(",")));
    expect(pairSet.size).toEqual(input.length);
  };

  expectUniquePairings(prelims.get("div1"), 6);
  expectUniquePairings(prelims.get("div2"), 9);
  expectUniquePairings(prelims.get("div3"), 6);
});

test("error with bad number of teams", () => {
  for (const i of [0, 1, 2, 3, 5]) {
    const teams = Array(i).map((_, i) => ({
      id: `t${i}`,
    }));
    expect(() => {
      generatePrelimGames([
        {
          id: "div",
          teams,
        },
      ]);
    }).toThrow();
  }
});
