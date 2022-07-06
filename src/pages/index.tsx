import { faker } from "@faker-js/faker";
import type { NextPage } from "next";
import Head from "next/head";
import { LinkButton } from "../frontend/shared/components/link-button";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const utils = trpc.useContext();
  const { mutate } = trpc.useMutation(["player.create-player"], {
    onSuccess(input) {
      utils.invalidateQueries("player.get-all-players");
    },
  });
  const { data, isLoading } = trpc.useQuery(["player.get-all-players"]);
  return (
    <>
      <Head>
        <title>Cribbly</title>
      </Head>

      <div className="flex flex-col items-center">
        <h1 className="text-8xl sm:text-9xl py-8 font-bold">
          Crib<span className="text-blue-700">b</span>
          <span className="text-red-600">l</span>
          <span className="text-green-600">y</span>
        </h1>
        <h2 className="text-3xl sm:text-4xl py-4 text-slate-800 text-center">
          2022 Szczepaniak Charity Cribbage Tournament
        </h2>
        <div className="flex flex-col items-center p-6">
          <LinkButton href="/games">View Games</LinkButton>
          <LinkButton href="/results/prelim">View Prelim Standings</LinkButton>
        </div>
        Experiment zone:
        <button
          className="bg-red-200"
          onClick={() => {
            mutate({
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
            });
          }}
        >
          Create Random Player
        </button>
        All players:
        {!isLoading && data && (
          <ul>
            {data.map((p) => (
              <li key={p.id}>
                {p.firstName} {p.lastName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Home;
