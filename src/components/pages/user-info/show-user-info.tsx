"use client";

import { regular18 } from "~/styles/fonts";
import { white } from "~/utils/colors";
import { Flex, Icon, Text, Button } from "@chakra-ui/react";

import React, { useState } from "react";
import { IoPersonSharp, IoDocumentTextOutline } from "react-icons/io5";
import { styles } from "./show-user-info.module";
import ChangePasswordDialog from "../change-password-dialog/change-password-dialog";
import type { TSafeUser } from "~/utils/validators";
import CustomInput from "~/components/ui/input/input";

interface ShowUserInfoProps {
  user: TSafeUser | undefined;
  isProjectLoading: boolean;
}

export default function ShowUserInfo({
  user,
  isProjectLoading,
}: ShowUserInfoProps) {
  const [showPersonHistory, setShowPersonHistory] = useState(false);
  const handleShowPersonHistory = () =>
    setShowPersonHistory(!showPersonHistory);

  return (
    <Flex sx={styles.MainContainer}>
      <Flex flexDirection="column" ml="5" mr="5">
        <Text sx={regular18}>Información paciente</Text>
        <Flex flexDirection="row" mt="8">
          <Flex
            flexDirection="column"
            mr="5"
            alignItems="center"
            alignContent="center"
          >
            <Flex bgColor="#D9D9D9">
              <Icon sx={styles.LogoutIcon} viewBox="-1 -1 17 17">
                <IoPersonSharp />
              </Icon>
            </Flex>
            <Flex flexDirection="column" w="200px">
              <Button
                bg="#FF2B91"
                color={white}
                iconSpacing="16px"
                sx={styles.Button}
                leftIcon={
                  <Icon fontSize="24px" mb="1px" ml="1px">
                    <IoDocumentTextOutline />
                  </Icon>
                }
                mr="1"
                onClick={handleShowPersonHistory}
              >
                CAMBIAR CONTRASEÑA
              </Button>
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            {!isProjectLoading && (
              <>
                <Flex flexDirection="row" mb="30">
                  <Flex flexDirection="column" w="417px">
                    <CustomInput
                      label="NOMBRE DE USUARIO"
                      height="47"
                      defaultValue={user?.username}
                      isReadOnly
                    />
                  </Flex>
                </Flex>
                <Flex flexDirection="row" mb="30">
                  <Flex flexDirection="column" w="417px">
                    <CustomInput
                      label="CORREO ELECTRÓNICO"
                      height="47"
                      defaultValue={user?.email}
                      isReadOnly
                    />
                  </Flex>
                </Flex>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
      <ChangePasswordDialog
        user={user}
        isOpen={showPersonHistory}
        onClose={handleShowPersonHistory}
      />
    </Flex>
  );
}
