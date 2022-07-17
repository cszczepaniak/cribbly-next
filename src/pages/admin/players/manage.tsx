import { NextPage } from "next";
import { Button } from "@components/styled-button";
import { trpc } from "utils/trpc";
import { InferQueryOutput } from "@shared/utils/trpc-utils";

const ManagePlayers: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["player.get-all-players"]);
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">
        Manage Players
      </h1>
      <PlayerList isLoading={isLoading} data={data} />
    </div>
  );
};

const PlayerList: React.FC<{
  isLoading: boolean;
  data: InferQueryOutput<"player.get-all-players"> | undefined;
}> = ({ isLoading, data }) => {
  const context = trpc.useContext();
  const { mutate } = trpc.useMutation("player.delete-player", {
    onSuccess: () => {
      context.invalidateQueries("player.get-all-players");
    },
  });

  if (isLoading || !data) {
    return <div className="text-lg">Loading players...</div>;
  }
  return (
    <ul className="w-full max-w-lg">
      {data.map((p, i) => (
        <li
          key={p.id}
          className="flex flex-row space-y-4 justify-between items-center w-full"
        >
          <p className="text-xl">
            {p.firstName} {p.lastName}
          </p>
          <Button
            className="bg-slate-100 hover:bg-red-50 border border-red-600 w-32 text-lg p-2 text-red-600"
            onClick={() => mutate({ id: p.id })}
          >
            Delete
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default ManagePlayers;
