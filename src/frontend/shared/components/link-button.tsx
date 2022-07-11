import Link from "next/link";
import { PropsWithChildren } from "react";
import { Button } from "./styled-button";

const LinkButton: React.FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => {
  return (
    <Link href={href}>
      <Button>{children}</Button>
    </Link>
  );
};

export { LinkButton };
