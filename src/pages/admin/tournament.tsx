import { Button } from "@components/styled-button";
import { NextPage } from "next";
import { trpc } from "utils/trpc";

const Tournament: NextPage = () => {
  const { mutate, error, isError } = trpc.useMutation("game.create-prelims");

  return (
    <div className="w-full flex flex-col items-center p-4">
      <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">
        Tournament
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
    </div>
  );
};

export default Tournament;
