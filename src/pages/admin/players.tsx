import { nanoid } from "nanoid";
import { NextPage } from "next";
import { useState } from "react";
import { Button } from "@components/styled-button";

const Players: NextPage = () => {
  const [playerList, setPlayerList] = useState<
    { tempID: string; name: string }[]
  >([]);
  const [name, setName] = useState("");

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-lg w-full space-y-4">
        <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">
          Players
        </h1>

        <form
          className="w-full max-w-lg flex flex-col space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setPlayerList((pl) => [...pl, { name, tempID: nanoid() }]);
            setName("");
          }}
        >
          <input
            type="text"
            className="appearance-none border rounded-md w-full p-4 text-gray-700 leading-tight focus:outline-none text-2xl"
            placeholder="Enter player name..."
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <Button type="submit" disabled={name === ""}>
            Add
          </Button>
        </form>
        <Button disabled={playerList.length === 0}>Save All</Button>
        <ul className="w-full">
          {playerList.map((p, i) => (
            <li
              key={p.tempID}
              className="flex flex-row space-y-4 justify-between items-center w-full"
            >
              <p className="text-xl">{p.name}</p>
              <div className="text-red-600">
                <Button
                  className="bg-slate-100 hover:bg-red-50 border border-red-600 w-32 text-lg p-2 text-current"
                  onClick={() =>
                    setPlayerList((pl) => [
                      ...pl.slice(0, i),
                      ...pl.slice(i + 1),
                    ])
                  }
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Players;
