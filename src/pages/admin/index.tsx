import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { LinkButton } from "../../frontend/shared/components/link-button";

const AdminHome: NextPage = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-5xl font-semibold pt-8 pb-4 text-center">
        Cribbly Admin
      </h1>
      {session ? (
        <>
          <h2 className="text-xl py-8">Signed in as {session.user?.email}</h2>
          <div className="max-w-lg">
            <LinkButton href="/admin/players">Player Management</LinkButton>
            <LinkButton href="/admin/teams">Team Management</LinkButton>
            <LinkButton href="/admin/divisions">Division Management</LinkButton>
            <LinkButton href="/admin/tournament">
              Tournament Management
            </LinkButton>
          </div>
        </>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  );
};

export default AdminHome;
