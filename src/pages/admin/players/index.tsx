import { LinkButton } from "@components/link-button";
import { NextPage } from "next/types";

const PlayersAdmin: NextPage = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">Players</h1>
      <div className="max-w-lg space-y-4">
        <LinkButton href="/admin/players/add">Add Players</LinkButton>
        <LinkButton href="/admin/players/manage">Manage Players</LinkButton>
      </div>
    </div>
  );
};

export default PlayersAdmin;
