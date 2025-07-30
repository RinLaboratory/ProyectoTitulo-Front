"use client";

import ShowUserInfo from "~/components/pages/user-info/show-user-info";
import React from "react";
import { fetcher } from "~/utils/fetcher";
import useSWR from "swr";
import ShowAdminInfo from "~/components/pages/admin-info/show-admin-info";
import type { TSafeUser } from "~/utils/validators";

export default function UserInfo() {
  const { data: user, isLoading: isUserLoading } = useSWR<TSafeUser>(
    `/getCurrentUser`,
    fetcher,
  );

  return (
    !isUserLoading && (
      <>
        {user?.rol !== "*" && (
          <ShowUserInfo user={user} isUserLoading={isUserLoading} />
        )}
        {user?.rol === "*" && (
          <ShowAdminInfo user={user} isUserLoading={isUserLoading} />
        )}
      </>
    )
  );
}
