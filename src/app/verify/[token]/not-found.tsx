"use client";

import { usePathname } from "next/navigation";

export default function NotFoundTokenPage() {
    const pathname = usePathname();
    const verifyId = pathname.split("/");
  return (
    <>
      <div>
        <h1>
          VERIFY TOKEN PAGE {verifyId} <br /> NOT FOUND
        </h1>
      </div>
    </>
  );
}
