"use client";

import ShowUserInfo from "~/components/pages/user-info/show-user-info";
import React from "react";
import { URL } from "~/utils/consts";
import { fetcher } from "~/utils/fetcher";
import useSWR from "swr";
import ShowAdminInfo from "~/components/pages/admin-info/show-admin-info";
import type { TSafeUser } from "~/utils/types";

export default function UserInfo() {
  const { data: user, isLoading: isProjectLoading } = useSWR<TSafeUser>(
    `${URL}/getCurrentUser`,
    fetcher
  );

  return (
    !isProjectLoading && (
      <>
        {user?.rol !== "*" && (
          <ShowUserInfo user={user} isProjectLoading={isProjectLoading} />
        )}
        {user?.rol === "*" && (
          <ShowAdminInfo user={user} isProjectLoading={isProjectLoading} />
        )}
      </>
    )
  );
}
