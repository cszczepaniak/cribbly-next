import Link from "next/link";
import { PropsWithChildren } from "react";

const LinkButton: React.FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => {
  return (
    <Link href={href}>
      <button className="bg-blue-700 text-slate-100 w-full rounded-md p-4 mb-8 text-2xl font-semibold">
        {children}
      </button>
    </Link>
  );
};

export { LinkButton };
