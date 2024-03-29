import { NextPage } from "next";
import { trpc } from "utils/trpc";
import { InferQueryOutput } from "@shared/utils/trpc-utils";
import { getTeamName } from "@shared/utils/teams";
import { Button } from "@components/styled-button";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Games: NextPage = () => {
  const ctx = trpc.useContext();
  const { data, isLoading: prelimsLoading } = trpc.useQuery([
    "game.get-prelims",
  ]);
  const {
    mutate,
    error,
    isError,
    isLoading: prelimsCreating,
  } = trpc.useMutation("game.create-prelims", {
    onSuccess: () => {
      ctx.invalidateQueries(["game.get-prelims"]);
    },
  });

  return (
    <div className="flex flex-col items-center p-4">
      <div className="max-w-lg w-full">
        <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">
          Manage Games
        </h1>
        <Button
          disabled={prelimsCreating}
          className="mb-8 disabled:bg-blue-300 disabled:italic"
          onClick={() => {
            mutate();
          }}
        >
          {prelimsCreating ? "Processing..." : "Generate Prelim Games"}
        </Button>
        {isError && <p className="text-red-500">{error.message}</p>}
        <GameList isLoading={prelimsLoading} data={data} />
      </div>
    </div>
  );
};

const GameList: React.FC<{
  isLoading: boolean;
  data: InferQueryOutput<"game.get-prelims"> | undefined;
}> = ({ isLoading, data }) => {
  const [parent] = useAutoAnimate<HTMLDivElement>();
  const [showMore, setShowMore] = useState(false);
  if (isLoading || !data) {
    return <div className="text-lg">Loading games...</div>;
  }
  return (
    <div ref={parent} className="w-full border border-slate-300 p-2 rounded-md">
      <div className="flex flex-row justify-between">
        <h3 className="text-xl font-semibold">Prelim Game List</h3>
        <button
          className="bg-gray-100 hover:bg-gray-200 border border-black text-sm px-2 rounded-md"
          onClick={() => setShowMore((prev) => !prev)}
        >
          {showMore ? "Show Less" : "Show More"}
        </button>
      </div>
      {showMore && (
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
      )}
    </div>
  );
};

export default Games;
