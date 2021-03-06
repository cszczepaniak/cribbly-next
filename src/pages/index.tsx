import type { NextPage } from "next";
import Head from "next/head";
import { LinkButton } from "../frontend/shared/components/link-button";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Cribbly</title>
      </Head>

      <div className="flex flex-col items-center p-4">
        <h1 className="text-8xl sm:text-9xl py-8 font-bold">
          Crib<span className="text-blue-700">b</span>
          <span className="text-red-600">l</span>
          <span className="text-green-600">y</span>
        </h1>
        <h2 className="text-3xl sm:text-4xl py-4 text-slate-800 text-center">
          2022 Szczepaniak Charity Cribbage Tournament
        </h2>
        <div className="flex flex-col space-y-4 items-center p-6 w-full max-w-lg">
          <LinkButton href="/games">View Games</LinkButton>
          <LinkButton href="/results/prelim">View Prelim Standings</LinkButton>
        </div>
      </div>
    </>
  );
};

export default Home;
