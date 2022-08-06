import { NextPage } from "next";
import { trpc } from "utils/trpc";
import { InferQueryOutput } from "@shared/utils/trpc-utils";
import { getTeamName } from "@shared/utils/teams";

const Games: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["game.get-prelims"]);
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">
        Manage Games
      </h1>
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
