import { faker } from "@faker-js/faker";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { PropsWithChildren } from "react";
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
        <h1 className=" text-8xl sm:text-9xl py-8 font-bold">
          Crib<span className="text-blue-700">b</span>
          <span className="text-red-600">l</span>
          <span className="text-green-600">y</span>
        </h1>
        <h2 className="text-3xl sm:text-4xl py-4 text-slate-800 text-center">
          2022 Szczepaniak Charity Cribbage Tournament
        </h2>
        <div className="flex flex-col items-center p-6">
          <HomeLink href="/games">View Games</HomeLink>
          <HomeLink href="/results/prelim">View Prelim Standings</HomeLink>
        </div>
      </div>
    </>
  );
};

const HomeLink: React.FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => {
  return (
    <Link href={href}>
      <button className="bg-blue-700 text-slate-100 w-full rounded-md p-4 mb-8 text-2xl font-semibold">
        {children}
      </button>
    </Link>
  );
};

export default Home;
