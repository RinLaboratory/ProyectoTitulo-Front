"use client";

import { regular18 } from "~/styles/fonts";
import { Flex, Icon, Text, Button } from "@chakra-ui/react";

import React, { useState } from "react";
import { IoBed, IoSearch, IoMedical } from "react-icons/io5";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { styles } from "./index.module";
import RestingDialog from "./resting-dialog/resting-dialog";
import { fetcher } from "~/utils/fetcher";
import useSWR from "swr";
import { URL } from "~/utils/consts";
import type { TIndexData, TPersonState } from "~/utils/validators";

export default function Index() {
  const [activeDialog, setActiveDialog] = useState(false);
  const [listMode, setListMode] = useState<TPersonState>("retirado");

  const { data: indexData, isLoading: isIndexDataLoading } = useSWR<TIndexData>(
    `${URL}/getIndexData`,
    fetcher
  );

  const handleDialog = (mode: TPersonState) => {
    setListMode(mode);
    setActiveDialog(!activeDialog);
  };

  const buttonSelector = [
    {
      id: 0,
      text: `Tienes a ${indexData?.reposo.length ?? 0} personas en reposo`,
      action: () => handleDialog("reposo"),
      icon: <IoBed />,
    },
    {
      id: 1,
      text: `${indexData?.retirado.length ?? 0} personas se han retirado hoy`,
      action: () => handleDialog("retirado"),
      icon: <IoMedical />,
    },
    {
      id: 2,
      text: `Has atendido a ${indexData?.atendido.length ?? 0} personas hoy`,
      action: () => handleDialog("atendido"),
      icon: <FaPersonCircleCheck />,
    },
  ];

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
      <RestingDialog
        isOpen={activeDialog}
        onClose={() => setActiveDialog(false)}
        mode={listMode}
        indexData={indexData}
        isLoading={isIndexDataLoading}
      />
    </Flex>
  );
}
