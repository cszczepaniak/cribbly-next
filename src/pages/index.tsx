import { faker } from "@faker-js/faker";
import type { NextPage } from "next";
import Head from "next/head";
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
        <h1 className="font-extrabold text-center text-7xl">Cribbly</h1>
        <button
          className="my-10 p-4 bg-blue-400 text-xl text-gray-800 font-semibold rounded-lg"
          onClick={() => {
            const name = faker.name;
            mutate({ firstName: name.firstName(), lastName: name.lastName() });
          }}
        >
          Create Random Player
        </button>

        <div className="flex flex-col">
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-b-slate-800">
            All Players
          </h2>
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
      </div>
    </>
  );
};

export default Home;
