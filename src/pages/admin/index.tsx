import { LinkButton } from "@components/link-button";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

const AdminLinks: React.FC<{ email: string }> = ({ email }) => {
  const { data, isLoading } = trpc.useQuery(["admin.get-is-admin"]);

  if (isLoading || !data) {
    return <div>Loading admin data...</div>;
  }

  if (!data.isAdmin) {
    return (
      <>
        <div>Ope! Doesn&apos;t look like you&apos;re an admin...</div>
        <h2 className="text-xl py-8">Signed in as {email}</h2>
      </>
    );
  }

  return (
    <>
      <h2 className="text-xl py-8">Signed in as {email}</h2>
      <div className="max-w-lg">
        <LinkButton href="/admin/players">Player Management</LinkButton>
        <LinkButton href="/admin/teams">Team Management</LinkButton>
        <LinkButton href="/admin/divisions">Division Management</LinkButton>
        <LinkButton href="/admin/tournament">Tournament Management</LinkButton>
      </div>
    </>
  );
};

const AdminHome: NextPage = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-5xl font-semibold pt-8 pb-4 text-center">
        Cribbly Admin
      </h1>
      {session && session.user?.email ? (
        <AdminLinks email={session.user.email} />
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  );
};

export default AdminHome;
