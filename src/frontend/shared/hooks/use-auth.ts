import { signIn, useSession } from "next-auth/react";
import React from "react";
import { trpc } from "utils/trpc";

export function useAuth() {
  const { data: session } = useSession({
    required: true, onUnauthenticated: () => {
      console.log('unauthed!')
      signIn()
    }
  });
  const isLocal = React.useMemo(
    () => process.env.NODE_ENV === "development",
    []
  );
  const { data, isLoading } = trpc.useQuery([
    "admin.get-is-admin",
    { isLocal },
  ]);

  if (isLocal) {
    return {
      isAdmin: true,
      isLoading: false,
      email: "testuser@local.com",
    };
  }
  console.log(`isLoading: ${isLoading}; sessionUser: ${session?.user}; data: ${data}`)

  if (isLoading || !data || !session?.user) {
    return { isAdmin: false, isLoading: true, email: "" };
  }

  return {
    isAdmin: data.isAdmin,
    isLoading: false,
    email: session.user.email,
  };
}
