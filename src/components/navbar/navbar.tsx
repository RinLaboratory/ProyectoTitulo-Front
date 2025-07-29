"use client";

import React from "react";

import {
  Box,
  Text,
  Button,
  Spacer,
  Flex,
  useMediaQuery,
  Icon,
} from "@chakra-ui/react";
import Link from "next/link";
import { light10, light18 } from "~/styles/fonts";

import {
  IoSearch,
  IoPerson,
  IoLogOutOutline,
  IoHomeOutline,
} from "react-icons/io5";

import { styles } from "./navbar.module";
import { softBlue, white, yellow } from "~/utils/colors";
import { URL } from "~/utils/consts";
import { fetcher } from "~/utils/fetcher";
import useSWR from "swr";
import type { TSafeUser } from "~/utils/validators";

export default function NavBar() {
  const [isLargerThan1300] = useMediaQuery("(min-width: 1300px)");
  const [isLargerThan950] = useMediaQuery("(min-width: 950px)");

  const { data: user, isLoading: isProjectLoading } = useSWR<TSafeUser>(
    `${URL}/getCurrentUser`,
    fetcher
  );

  return (
    <Flex sx={styles.NavBarContainer}>
      <Flex sx={styles.NavBarPosition}>
        <Box sx={styles.ButtonContainer}>
          <Link href="/search" passHref>
            <Button
              bg={yellow}
              color={softBlue}
              iconSpacing={isLargerThan1300 ? "16px" : "0px"}
              sx={styles.Button}
              leftIcon={
                <Icon fontSize="24px" mb="1px" ml="1px">
                  <IoSearch />
                </Icon>
              }
              mr="1"
            >
              {isLargerThan1300 ? "EXPLORAR" : ""}
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button
              bg={yellow}
              color={softBlue}
              iconSpacing={isLargerThan1300 ? "16px" : "0px"}
              sx={styles.Button}
              leftIcon={
                <Icon fontSize="24px" mb="1px" ml="1px">
                  <IoHomeOutline />
                </Icon>
              }
              mr="1"
            >
              {isLargerThan1300 ? "INICIO" : ""}
            </Button>
          </Link>
        </Box>
        <Spacer />
        {!isProjectLoading && (
          <>
            <Box sx={styles.UserInfoContainer}>
              <Link href={"/user-info"} passHref>
                <Icon sx={styles.UserIcon} viewBox="-1 -1 17 17">
                  <IoPerson />
                </Icon>
              </Link>
              <Box color={white}>
                <Text sx={light18}>{user?.username}</Text>
                {isLargerThan950 ? (
                  <Text sx={light10}>{user?.email}</Text>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
            <Box sx={styles.LogoutContainer}>
              <Link href="/logout" passHref>
                <Button
                  variant="link"
                  pl="4"
                  color={white}
                  rightIcon={
                    <Icon sx={styles.LogoutIcon} viewBox="-1 -1 17 17">
                      <IoLogOutOutline />
                    </Icon>
                  }
                  size="md"
                >
                  {isLargerThan950 ? "Cerrar sesión" : ""}
                </Button>
              </Link>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
}
