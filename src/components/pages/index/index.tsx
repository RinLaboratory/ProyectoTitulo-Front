"use client";

import { regular18 } from "~/styles/fonts";
import { Flex, Icon, Text, Button } from "@chakra-ui/react";

import type { ReactElement } from "react";
import React, { useEffect, useState } from "react";
import { IoBed, IoSearch, IoMedical } from "react-icons/io5";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { styles } from "./index.module";
import Resting from "./resting/resting";
import { fetcher } from "~/utils/fetcher";
import useSWR from "swr";
import { URL } from "~/utils/consts";
import type { TIndexData, TPersonState } from "~/utils/types";

export default function Index() {
  const { data: indexData, isLoading: isProjectLoading } = useSWR<TIndexData>(
    `${URL}/getIndexData`,
    fetcher
  );

  const [showAreaList, setShowAreaList] = useState(false);
  const handleShowAreaList = () => setShowAreaList(!showAreaList);

  const [listMode, setListMode] = useState<TPersonState>("retirado");

  const handleDialog = (mode: TPersonState) => {
    setListMode(mode);
    handleShowAreaList();
  };

  const [buttonSelector, setButtonSelector] = useState<
    {
      id: number;
      text: string;
      action: () => void;
      icon: ReactElement;
    }[]
  >([]);

  useEffect(() => {
    if (indexData) {
      setButtonSelector([
        {
          id: 0,
          text: `Tienes a ${indexData.reposo.length} personas en reposo`,
          action: () => handleDialog("reposo"),
          icon: <IoBed />,
        },
        {
          id: 1,
          text: `${indexData.retirado.length} personas se han retirado hoy`,
          action: () => handleDialog("retirado"),
          icon: <IoMedical />,
        },
        {
          id: 2,
          text: `Has atendido a ${indexData.atendido.length} personas hoy`,
          action: () => handleDialog("atendido"),
          icon: <FaPersonCircleCheck />,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexData]);

  return (
    <Flex sx={styles.MainContainer}>
      {buttonSelector.map((data, key) => (
        <Flex key={key} sx={styles.OptionContainer}>
          <Flex sx={styles.BigIconContainer}>
            <Icon sx={styles.BigIcon} viewBox="-0.5 -1 17 17">
              {data.icon}
            </Icon>
          </Flex>
          <Flex sx={styles.LeftOptionContainer}>
            <Text sx={regular18}>{data.text}</Text>
            <Button
              sx={styles.Button}
              onClick={data.action}
              leftIcon={
                <Icon fontSize="24px" mb="1px" ml="1px">
                  <IoSearch />
                </Icon>
              }
            >
              REVISAR
            </Button>
          </Flex>
        </Flex>
      ))}
      <Resting
        isOpen={showAreaList}
        onClose={handleShowAreaList}
        mode={listMode}
        data={indexData}
        isLoading={isProjectLoading}
      />
    </Flex>
  );
}
