import { Button } from "@components/styled-button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { fullPlayerName, Player } from "@shared/utils/players";
import { sortFalsyFirst } from "@shared/utils/sort";
import { getTeamName } from "@shared/utils/teams";
import { InferQueryOutput } from "@shared/utils/trpc-utils";
import clsx from "clsx";
import { NextPage } from "next";
import { useDrag, useDrop } from "react-dnd";
import { trpc } from "utils/trpc";

const playerDnDType = "PLAYER";

const Teams: NextPage = () => {
  const [playerParent] = useAutoAnimate<HTMLUListElement>();
  const [teamParent] = useAutoAnimate<HTMLUListElement>();
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
    <div className="w-full flex flex-col items-center p-4 h-screen">
      <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">Teams</h1>
      <Button className="max-w-md mb-8" onClick={() => clearAllTeams()}>
        Clear All Teams
      </Button>
      <div className="flex flex-row justify-between w-full max-w-3xl overflow-hidden">
        <ul
          ref={teamParent}
          className="w-1/2 pr-2 mr-4 basis-2/3 flex flex-col space-y-2 overflow-auto"
        >
          {teams
            .sort(sortFalsyFirst((t) => t.players.length === 2))
            .map((t) => (
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
        <ul
          ref={playerParent}
          className="w-1/2 pl-2 basis-1/3 flex flex-col space-y-4 overflow-auto"
        >
          {players.sort(sortFalsyFirst((p) => p.teamID)).map((p) => (
            <li key={p.id}>
              <PlayerCard player={p} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const PlayerCard: React.FC<{
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
        "border-slate-300 rounded-md w-full border p-2 cursor-move",
        (isDragging || player.teamID) && "opacity-25",
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
  const [parent] = useAutoAnimate<HTMLDivElement>();
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
        "border-slate-300 rounded-md w-full border p-2 space-y-1",
        isOver && team.players.length < 2 && "bg-blue-100",
        team.players.length === 2 && "bg-green-100",
      ])}
    >
      <p className="text-2xl mb-2">{getTeamName(team.players)}</p>
      <div ref={parent}>
        <PlayerRow index={0} team={team} />
        <PlayerRow index={1} team={team} />
      </div>
    </div>
  );
};

const PlayerRow: React.FC<{
  team: InferQueryOutput<"team.get-all-teams">[number];
  index: number;
}> = ({ team, index }) => {
  const ctx = trpc.useContext();
  const { mutate: removePlayer } = trpc.useMutation("team.remove-player", {
    onSuccess: () => {
      ctx.invalidateQueries("player.get-all-players");
      ctx.invalidateQueries("team.get-all-teams");
    },
  });
  const player = team.players[index];
  return (
    <div className="text-lg flex flex-row justify-between">
      <span>
        Player {`${index + 1}`}: {fullPlayerName(player)}
      </span>
      {player && (
        <button
          className="text-sm border border-black px-2 rounded-md"
          onClick={() => removePlayer({ teamID: team.id, playerID: player.id })}
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default Teams;
