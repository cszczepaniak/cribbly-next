import { LinkButton } from "@components/link-button";
import { useAuth } from "frontend/shared/hooks/use-auth";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

const AdminLinks: React.FC<{ email: string; isAdmin: boolean }> = ({
  email,
  isAdmin,
}) => {
  if (!isAdmin) {
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
      <div className="max-w-lg space-y-4">
        <LinkButton href="/admin/players">Player Management</LinkButton>
        <LinkButton href="/admin/teams">Team Management</LinkButton>
        <LinkButton href="/admin/divisions">Division Management</LinkButton>
        <LinkButton href="/admin/tournament">Tournament Management</LinkButton>
      </div>
    </>
  );
};

const AdminHome: NextPage = () => {
  const { email, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading admin data...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-5xl font-semibold pt-8 pb-4 text-center">
        Cribbly Admin
      </h1>
      {email ? (
        <AdminLinks email={email} isAdmin={isAdmin} />
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  );
};

export default AdminHome;
