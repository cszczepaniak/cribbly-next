import { InferQueryOutput } from "./trpc-utils";

export type Player = InferQueryOutput<"player.get-all-players">[number];

export function fullPlayerName(p: Player | undefined) {
  if (!p) {
    return "";
  }
  return `${p.firstName} ${p.lastName}`;
}
