import { Button } from "@components/styled-button";
import { divisionNameSchema } from "@shared/schemas";
import { sortFalsyFirst } from "@shared/utils/sort";
import { getTeamName } from "@shared/utils/teams";
import { InferQueryOutput } from "@shared/utils/trpc-utils";
import clsx from "clsx";
import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "utils/trpc";
import { z } from "zod";

const divisionDnDType = "DIVISION";

function invalidateAll(ctx: ReturnType<typeof trpc.useContext>) {
  ctx.invalidateQueries("team.get-full");
  ctx.invalidateQueries("division.get-all");
}

const Divisions: NextPage = () => {
  const ctx = trpc.useContext();

  const { data: teams, isLoading: teamsLoading } = trpc.useQuery([
    "team.get-full",
  ]);

  const { data: divisions, isLoading: divisionsLoading } = trpc.useQuery([
    "division.get-all",
  ]);

  const { mutate: clearAllDivisions } = trpc.useMutation(
    ["division.clear-all"],
    {
      onSuccess: () => {
        invalidateAll(ctx);
      },
    }
  );

  const { mutate: addDivision } = trpc.useMutation(["division.create"], {
    onSuccess: () => {
      ctx.invalidateQueries("division.get-all");
    },
  });

  const sortedTeams = useMemo(
    () =>
      teams?.sort(
        sortFalsyFirst(
          (t) => t.divisionID,
          (t1, t2) => {
            return getTeamName(t1.players).localeCompare(
              getTeamName(t2.players)
            );
          }
        )
      ),
    [teams]
  );

  if (teamsLoading || divisionsLoading || !sortedTeams || !divisions) {
    return <div>data loading...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center p-4 h-screen">
      <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">
        Divisions
      </h1>
      <p className="text-2xl pb-4">
        All divisions must either have 4 or 6 players.
      </p>
      <Button className="max-w-md mb-8" onClick={() => clearAllDivisions()}>
        Clear All Divisions
      </Button>
      <div className="flex flex-row justify-between w-full max-w-3xl  overflow-hidden">
        <ul className="w-1/2 pr-2 basis-2/3 flex flex-col space-y-2 overflow-auto">
          {divisions
            .sort(
              sortFalsyFirst(
                (div) => div.teams.length == 4 || div.teams.length == 6
              )
            )
            .map((d) => (
              <li key={d.id}>
                <Division division={d} />
              </li>
            ))}
          <li>
            <button
              className="border-slate-300 rounded-md w-full border border-dashed p-2 hover:opacity-50 hover:border-solid"
              onClick={() =>
                addDivision({
                  name: "New Division",
                })
              }
            >
              <p className="text-2xl mb-2">Add Division</p>
            </button>
          </li>
        </ul>
        <ul className="w-1/2 pl-2 basis-1/3 flex flex-col space-y-4 overflow-auto">
          {sortedTeams.map((t) => (
            <li key={t.id}>
              <Team team={t} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Team: React.FC<{
  team: InferQueryOutput<"team.get-all-teams">[number];
}> = ({ team }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: divisionDnDType,
    item: { teamID: team.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={clsx([
        "border-slate-300 rounded-md w-full border p-2 cursor-move",
        (isDragging || team.divisionID) && "opacity-25",
      ])}
    >
      <p>{getTeamName(team.players)}</p>
    </div>
  );
};

const Division: React.FC<{
  division: InferQueryOutput<"division.get-all">[number];
}> = ({ division }) => {
  const ctx = trpc.useContext();
  const { mutate: addTeamToDivision } = trpc.useMutation(
    ["division.add-team"],
    {
      onSuccess: () => {
        invalidateAll(ctx);
      },
    }
  );

  const [{ isOver }, drop] = useDrop<
    { teamID: string },
    void,
    { isOver: boolean }
  >(() => ({
    accept: divisionDnDType,
    drop: (item) => {
      addTeamToDivision({ divisionID: division.id, teamID: item.teamID });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={clsx([
        "border-slate-300 rounded-md w-full border p-2 space-y-1",
        isOver && "bg-blue-100",
        (division.teams.length == 4 || division.teams.length === 6) &&
          "bg-green-100",
      ])}
    >
      <EditableDivisionName division={division} />
      <ul className="space-y-2">
        {division.teams.map((t, i) => (
          <li key={t.id}>
            <TeamRow index={i} team={t} divisionID={division.id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const EditableDivisionName: React.FC<{
  division: { id: string; name: string };
}> = ({ division: { id, name } }) => {
  const ctx = trpc.useContext();
  const { mutate: setName } = trpc.useMutation(["division.set-name"], {
    onSuccess: () => {
      ctx.invalidateQueries(["division.get-all"]);
    },
  });
  const { mutate: deleteDivision } = trpc.useMutation(["division.delete"], {
    onSuccess: () => {
      ctx.invalidateQueries(["division.get-all"]);
      ctx.invalidateQueries(["team.get-full"]);
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isValid, isSubmitted },
  } = useForm<{ name: string }>({
    resolver: zodResolver(
      z.object({
        name: divisionNameSchema,
      })
    ),
    defaultValues: {
      name,
    },
  });

  const onSubmit: SubmitHandler<{ name: string }> = (data) => {
    setName({ id, name: data.name });
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) {
      setFocus("name");
    }
  }, [isEditing, setFocus]);

  return (
    <div className="flex flex-row mb-2">
      {isEditing ? (
        <form
          className="flex flex-col w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-row">
            <input
              {...register("name")}
              type="text"
              className="appearance-none border rounded-md w-full p-4 text-gray-700 leading-tight focus:outline-none text-2xl mr-2"
              placeholder="Division Name"
            />
            <div className="flex flex-col justify-around">
              <button
                type="submit"
                className="text-sm border border-black px-1 rounded"
                disabled={isSubmitted && !isValid}
              >
                Save
              </button>
            </div>
          </div>
          {errors.name?.message && (
            <p className="text-red-500">{errors.name.message}</p>
          )}
        </form>
      ) : (
        <>
          <p className="text-2xl mr-2">{name}</p>
          <div className="flex flex-col justify-around">
            <button
              className="text-sm border border-black px-1 rounded mr-2"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit
            </button>
          </div>
          <div className="flex flex-col justify-around">
            <button
              className="text-sm border border-black px-1 rounded"
              onClick={() => deleteDivision({ id })}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const TeamRow: React.FC<{
  divisionID: string;
  team: InferQueryOutput<"team.get-all-teams">[number];
  index: number;
}> = ({ team, index, divisionID }) => {
  const ctx = trpc.useContext();
  const { mutate: removeTeam } = trpc.useMutation("division.remove-team", {
    onSuccess: () => {
      invalidateAll(ctx);
    },
  });

  return (
    <div className="text-lg flex flex-row justify-between">
      <span>
        Team {`${index + 1}`}: {getTeamName(team.players)}
      </span>
      {team && (
        <button
          className="text-sm border border-black px-2 rounded-md"
          onClick={() =>
            removeTeam({ teamID: team.id, divisionID: divisionID })
          }
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default Divisions;
