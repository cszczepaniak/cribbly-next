import { Button } from "@components/styled-button";
import { fullPlayerName, Player } from "@shared/utils/players";
import { InferQueryOutput } from "@shared/utils/trpc-utils";
import clsx from "clsx";
import { NextPage } from "next";
import { useDrag, useDrop } from "react-dnd";
import { trpc } from "utils/trpc";

interface DropResult {
  teamID: string;
  playerIDs: string[];
}

const playerDnDType = "PLAYER";

const Teams: NextPage = () => {
  const ctx = trpc.useContext();

  const { data: teams, isLoading: teamsLoading } = trpc.useQuery([
    "team.get-all-teams",
  ]);

  const { data: players, isLoading: playersLoading } = trpc.useQuery([
    "player.get-all-players",
  ]);

  const { mutate: clearAllTeams } = trpc.useMutation(["team.clear-all-teams"], {
    onSuccess: () => {
      ctx.invalidateQueries("team.get-all-teams");
      ctx.invalidateQueries("player.get-all-players");
    },
  });

  const { mutate: addTeam } = trpc.useMutation(["team.create-team"], {
    onSuccess: () => {
      ctx.invalidateQueries("team.get-all-teams");
    },
  });

  if (teamsLoading || playersLoading || !teams || !players) {
    return <div>data loading...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">Teams</h1>
      <Button className="max-w-md" onClick={() => clearAllTeams()}>
        Clear All Teams
      </Button>
      <div className="flex flex-row justify-between w-full max-w-3xl">
        <ul className="w-1/2 p-2 basis-2/3 flex flex-col space-y-2">
          {teams.map((t, i) => (
            <li key={t.id}>
              <Team team={t} />
            </li>
          ))}
          <li>
            <button
              className="border-slate-300 rounded-md w-full border border-dashed p-2 hover:opacity-50 hover:border-solid"
              onClick={() => addTeam()}
            >
              <p className="text-2xl mb-2">Add Team</p>
            </button>
          </li>
        </ul>
        <ul className="w-1/2 p-2 basis-1/3 flex flex-col space-y-4">
          {players
            .sort((p) => (p.teamId ? 1 : -1))
            .map((p) => (
              <li key={p.id}>
                <Player player={p} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

const Player: React.FC<{
  player: InferQueryOutput<"player.get-all-players">[number];
}> = ({ player }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: playerDnDType,
    item: { playerID: player.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={clsx([
        "border-slate-300 rounded-md w-full border p-2",
        (isDragging || player.teamId) && "opacity-25",
      ])}
    >
      <p>
        {player.firstName} {player.lastName}
      </p>
    </div>
  );
};

const Team: React.FC<{
  team: InferQueryOutput<"team.get-all-teams">[number];
  log?: boolean;
}> = ({ team }) => {
  const ctx = trpc.useContext();
  const { mutate: addPlayerToTeam } = trpc.useMutation(["team.add-player"], {
    onSuccess: () => {
      ctx.invalidateQueries("team.get-all-teams");
      ctx.invalidateQueries("player.get-all-players");
    },
  });

  const [{ isOver }, drop] = useDrop<
    { playerID: string },
    void,
    { isOver: boolean }
  >(() => ({
    accept: playerDnDType,
    drop: (item) => {
      if (team.players.length < 2) {
        addPlayerToTeam({ teamID: team.id, playerID: item.playerID });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={clsx([
        "border-slate-300 rounded-md w-full border p-2",
        isOver && team.players.length < 2 && "bg-blue-100",
        team.players.length === 2 && "bg-green-100",
      ])}
    >
      <p className="text-2xl mb-2">{getTeamName(team.players)}</p>
      <p className="text-md">
        Player 1:{team.players[0] ? ` ${fullPlayerName(team.players[0])}` : ""}
      </p>
      <p className="text-md">
        Player 2:{team.players[1] ? ` ${fullPlayerName(team.players[1])}` : ""}
      </p>
    </div>
  );
};

const getTeamName = (players: Player[]) => {
  if (players[0] && !players[1]) {
    return `Team ${players[0]?.lastName}`;
  } else if (players[0] && players[1]) {
    return `Team ${players[0]?.lastName}/${players[1]?.lastName}`;
  }
  return "New Team";
};

export default Teams;
