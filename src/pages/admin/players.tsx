import { nanoid } from "nanoid";
import { NextPage } from "next";
import { useState } from "react";
import { Button } from "@components/styled-button";
import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { playerSchema } from "@shared/schemas";
import { z } from "zod";

type Inputs = {
  firstName: string;
  lastName: string;
};

const Players: NextPage = () => {
  const [playerList, setPlayerList] = useState<
    { tempID: string; firstName: string; lastName: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setFocus,
    formState: { errors, isValid, isSubmitted },
  } = useForm<Inputs>({
    resolver: zodResolver(playerSchema),
  });

  console.log(errors);
  console.log(isValid);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setFocus("firstName");
    setPlayerList((pl) => [...pl, { ...data, tempID: nanoid() }]);
    reset();
  };

  const { mutate, isLoading } = trpc.useMutation([
    "player.create-many-players",
  ]);

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-lg w-full space-y-4">
        <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">
          Players
        </h1>

        <form
          className="w-full max-w-lg flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-row space-x-2 justify-between">
            <div className="flex flex-col">
              <input
                {...register("firstName")}
                type="text"
                className="appearance-none border rounded-md w-full p-4 text-gray-700 leading-tight focus:outline-none text-2xl"
                placeholder="First Name"
              />
              {errors.firstName && (
                <p className="text-red-500 italic">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <input
                {...register("lastName")}
                type="text"
                className="appearance-none border rounded-md w-full p-4 text-gray-700 leading-tight focus:outline-none text-2xl"
                placeholder="Last Name"
              />
              {errors.lastName && (
                <p className="text-red-500 italic">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={
              !watch("firstName") ||
              !watch("lastName") ||
              (isSubmitted && !isValid)
            }
          >
            Add
          </Button>
        </form>
        <Button
          disabled={playerList.length === 0 || isLoading}
          onClick={() => {
            mutate(playerList);
            setPlayerList([]);
          }}
        >
          {isLoading ? <Spinner /> : "Save All"}
        </Button>
        <ul className="w-full">
          {playerList.map((p, i) => (
            <li
              key={p.tempID}
              className="flex flex-row space-y-4 justify-between items-center w-full"
            >
              <p className="text-xl">
                {p.firstName} {p.lastName}
              </p>
              <Button
                className="bg-slate-100 hover:bg-red-50 border border-red-600 w-32 text-lg p-2 text-red-600"
                onClick={() =>
                  setPlayerList((pl) => [...pl.slice(0, i), ...pl.slice(i + 1)])
                }
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Players;

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-red-500" title="0">
      <svg
        version="1.1"
        id="loader-1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 40 40"
        enableBackground="new 0 0 40 40"
        xmlSpace="preserve"
        className="fill-slate-100 w-8 h-8"
      >
        <path
          className="fill-slate-400"
          d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
          s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
          c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
        />
        <path
          d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
    C22.32,8.481,24.301,9.057,26.013,10.047z"
        >
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
};
