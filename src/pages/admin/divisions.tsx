import { Button } from "@components/styled-button";
import { getTeamName } from "@shared/utils/teams";
import { InferQueryOutput } from "@shared/utils/trpc-utils";
import clsx from "clsx";
import { NextPage } from "next";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { trpc } from "utils/trpc";

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

  if (teamsLoading || divisionsLoading || !teams || !divisions) {
    return <div>data loading...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center p-4">
      <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">
        Divisions
      </h1>
      <Button className="max-w-md mb-8" onClick={() => clearAllDivisions()}>
        Clear All Divisions
      </Button>
      <div className="flex flex-row justify-between w-full max-w-3xl">
        <ul className="w-1/2 pr-2 basis-2/3 flex flex-col space-y-2">
          {divisions.map((d) => (
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
        <ul className="w-1/2 pl-2 basis-1/3 flex flex-col space-y-4">
          {teams
            .sort((t1, t2) => {
              if (
                (!t1.divisionID && !t2.divisionID) ||
                (t1.divisionID && t2.divisionID)
              ) {
                // If both have a division ID or neither have a division ID, sort by their own ID
                return t1.id.localeCompare(t2.id);
              }
              // Now it's one or the other; put the one without an ID at the top
              return t1.divisionID ? 1 : -1;
            })
            .map((t) => (
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
  const { mutate: setName } = trpc.useMutation(["division.set-name"], {
    onSuccess: () => {
      ctx.invalidateQueries(["division.get-all"]);
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(division.name);

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
      ])}
    >
      <div className="flex flex-row mb-2">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="appearance-none border rounded-md w-full p-4 text-gray-700 leading-tight focus:outline-none text-2xl mr-2"
              placeholder="Division Name"
            />
            <div className="flex flex-col justify-around">
              <button
                className="text-sm border border-black px-1 rounded"
                disabled={!editValue}
                onClick={() => {
                  if (!editValue) {
                    return;
                  }
                  setName({ id: division.id, name: editValue });
                  setIsEditing(false);
                }}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-2xl mr-2">{division.name}</p>
            <div className="flex flex-col justify-around">
              <button
                className="text-sm border border-black px-1 rounded"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </div>
          </>
        )}
      </div>
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
