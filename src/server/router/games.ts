import { createRouter } from "./context";
import { prisma } from "../db/client";
import { generatePrelimGames } from "server/games/games";

export const gameRouter = createRouter().mutation("create-prelims", {
  async resolve() {
    const divs = await prisma.division.findMany({
      select: {
        id: true,
        name: true,
        teams: {
          select: {
            id: true,
          },
        },
      },
    });

    let invalid = divs.reduce((prev, div) => {
      if (div.teams.length !== 4 && div.teams.length !== 6) {
        return [...prev, div.name];
      }
      return prev;
    }, [] as string[]);
    if (invalid.length > 0) {
      throw new Error(
        `The following divisions are invalid: ${invalid.join(", ")}`
      );
    }

    const games = generatePrelimGames(divs);

    return await prisma.game.createMany({
      data: Array.from(games.entries()).flatMap(([divID, pairs]) =>
        pairs.map((pair) => ({
          kind: 0,
          team1ID: pair[0],
          team2ID: pair[0],
          divisionID: divID,
        }))
      ),
    });
  },
});
