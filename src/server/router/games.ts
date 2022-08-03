import { createRouter } from "./context";
import { prisma } from "../db/client";
import { generatePrelimGames } from "server/games/games";

export const gameRouter = createRouter().mutation("create-prelims", {
  async resolve() {
    const divs = await prisma.division.findMany({
      select: {
        id: true,
        teams: {
          select: {
            id: true,
          },
        },
      },
    });

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
