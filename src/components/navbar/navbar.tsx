import React from "react";

import { Box, Text, Button, Spacer, Flex, Icon } from "@chakra-ui/react";
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
import type { TSafeUser } from "~/utils/validators";

interface NavBarProps {
  user: TSafeUser;
}

export default function NavBar({ user }: NavBarProps) {
  return (
    <Flex sx={styles.NavBarContainer}>
      <Flex sx={styles.NavBarPosition}>
        <Box sx={styles.ButtonContainer}>
          <Link href="/search" passHref>
            <Button
              bg={yellow}
              color={softBlue}
              iconSpacing={{ base: "0px", xl: "16px" }}
              sx={styles.Button}
              leftIcon={
                <Icon fontSize="24px" mb="1px" ml="1px">
                  <IoSearch />
                </Icon>
              }
              mr="1"
            >
              <Text display={{ base: "none", xl: "block" }}>EXPLORAR</Text>
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button
              bg={yellow}
              color={softBlue}
              iconSpacing={{ base: "0px", xl: "16px" }}
              sx={styles.Button}
              leftIcon={
                <Icon fontSize="24px" mb="1px" ml="1px">
                  <IoHomeOutline />
                </Icon>
              }
              mr="1"
            >
              <Text display={{ base: "none", xl: "block" }}>INICIO</Text>
            </Button>
          </Link>
        </Box>
        <Spacer />
        <Box sx={styles.UserInfoContainer}>
          <Link href={"/user-info"} passHref>
            <Icon sx={styles.UserIcon} viewBox="-1 -1 17 17">
              <IoPerson />
            </Icon>
          </Link>
          <Box color={white}>
            <Text sx={light18}>{user.username}</Text>
            <Text sx={light10} display={{ base: "none", lg: "block" }}>
              {user.email}
            </Text>
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
              <Text display={{ base: "none", lg: "block" }}>Cerrar sesión</Text>
            </Button>
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
}
