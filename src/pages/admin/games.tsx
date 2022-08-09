import { NextPage } from "next";
import { trpc } from "utils/trpc";
import { InferQueryOutput } from "@shared/utils/trpc-utils";
import { getTeamName } from "@shared/utils/teams";
import { Button } from "@components/styled-button";

const Games: NextPage = () => {
  const ctx = trpc.useContext();
  const { data, isLoading } = trpc.useQuery(["game.get-prelims"]);
  const { mutate, error, isError } = trpc.useMutation("game.create-prelims", {
    onSuccess: () => {
      ctx.invalidateQueries(["game.get-prelims"]);
    },
  });

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">
        Manage Games
      </h1>
      <Button
        className="max-w-md mb-8"
        onClick={() => {
          mutate();
        }}
      >
        Generate Prelim Games
      </Button>
      {isError && <p className="text-red-500">{error.message}</p>}
      <GameList isLoading={isLoading} data={data} />
    </div>
  );
};

const GameList: React.FC<{
  isLoading: boolean;
  data: InferQueryOutput<"game.get-prelims"> | undefined;
}> = ({ isLoading, data }) => {
  if (isLoading || !data) {
    return <div className="text-lg">Loading games...</div>;
  }
  return (
    <ul className="w-full max-w-lg">
      {data.map((g, i) => (
        <li
          key={g.id}
          className="flex flex-row space-y-4 justify-between items-center w-full"
        >
          <p>
            {getTeamName(g.teams[0]?.players)} vs{" "}
            {getTeamName(g.teams[1]?.players)}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default Games;
