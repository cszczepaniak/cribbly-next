import { NextPage } from "next";
import { trpc } from "utils/trpc";

const Tournament: NextPage = () => {
  const { mutate, error, isError } = trpc.useMutation("game.create-prelims");

  return (
    <div className="w-full flex flex-col items-center p-4">
      <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">
        Tournament
      </h1>
    </div>
  );
};

export default Tournament;
