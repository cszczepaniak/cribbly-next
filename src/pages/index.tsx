import { faker } from "@faker-js/faker";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
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
        <h1 className="text-9xl py-8 font-bold">
          Crib<span className="text-blue-700">b</span>
          <span className="text-red-600">l</span>
          <span className="text-green-600">y</span>
        </h1>
        <h2 className="text-4xl py-4 text-slate-800">
          2022 Szczepaniak Charity Cribbage Tournament
        </h2>
        <div className="flex flex-col items-center p-6">
          <Link href="/games">
            <button className="bg-blue-700 text-slate-100 w-full rounded-md p-4 mb-8 text-2xl font-semibold">
              View Games
            </button>
          </Link>
          <Link href="/results/prelim">
            <button className="bg-blue-700 text-slate-100 w-full rounded-md p-4 mb-8 text-2xl font-semibold">
              View Prelim Standings
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
