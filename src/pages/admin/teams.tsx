import { NextPage } from "next";
import { trpc } from "utils/trpc";

const Teams: NextPage = () => {
  const ctx = trpc.useContext();

  const { data: teams, isLoading: teamsLoading } = trpc.useQuery([
    "team.get-all-teams",
  ]);

  const { data: players, isLoading: playersLoading } = trpc.useQuery([
    "player.get-all-players",
  ]);

  const { mutate: addTeam } = trpc.useMutation(["team.create-team"], {
    onSuccess: () => {
      ctx.invalidateQueries("team.get-all-teams");
    },
  });

  const { mutate: addPlayerToTeam } = trpc.useMutation(["team.add-player"], {
    onSuccess: () => {
      ctx.invalidateQueries("team.get-all-teams");
    },
  });

  if (teamsLoading || playersLoading || !teams || !players) {
    return <div>data loading...</div>;
  }

  return (
    <div className="w-full">
      <h1>Teams</h1>
      <button onClick={() => addTeam()}>New Team</button>
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-col">
          <ul className="space-y-4">
            {teams.map((t) => (
              <li key={t.id}>
                <div className="flex flex-row justify-between">
                  <p>{t.id}</p>
                  {t.players &&
                    t.players.map((p) => (
                      <span key={p.id}>
                        {p.firstName} {p.lastName}
                      </span>
                    ))}
                  <button
                    className="bg-blue-200"
                    onClick={() =>
                      addPlayerToTeam({
                        teamID: t.id,
                        playerID: players[0]?.id || "",
                      })
                    }
                  >
                    add a player
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <ul>
            {players.map((p) => (
              <li key={p.id}>
                {p.firstName} {p.lastName}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Teams;
