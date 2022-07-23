import { Player } from "@shared/utils/players";

export const getTeamName = (players: Player[]) => {
  if (players[0] && !players[1]) {
    return `Team ${players[0]?.lastName}`;
  } else if (players[0] && players[1]) {
    return `Team ${players[0]?.lastName}/${players[1]?.lastName}`;
  }
  return "New Team";
};
