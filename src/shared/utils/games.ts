export type gameKind = 0 | 1;
export function gameKindToString(kind: gameKind) {
  switch (kind) {
    case gameKindPrelim:
      return "prelim";
    case gameKindTournament:
      return "tournament";
  }
}
export const gameKindPrelim: gameKind = 0;
export const gameKindTournament: gameKind = 1;
