import { InferQueryOutput } from "./trpc-utils";

export type Player = InferQueryOutput<"player.get-all-players">[number];

export function fullPlayerName(p: Player) {
  return `${p.firstName} ${p.lastName}`;
}
