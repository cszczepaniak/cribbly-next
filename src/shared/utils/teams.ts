import { Player } from "@shared/utils/players";

export const getTeamName = (
  players: { firstName: string; lastName: string }[] | undefined
) => {
  if (players === undefined) {
    return "<undefined>";
  }
  if (players[0] && !players[1]) {
    return `Team ${players[0]?.lastName}`;
  } else if (players[0] && players[1]) {
    return `Team ${players[0]?.lastName}/${players[1]?.lastName}`;
  }
  return "New Team";
};
