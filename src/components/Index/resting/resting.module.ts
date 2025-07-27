import { softBlue, white } from "~/utils/colors";
import { regular18 } from "~/styles/fonts";

export const styles = {
  MainContainer: {
    bgColor: white,
    borderRadius: "12px",
    flexDirection: "column",
    mr: "10",
  },
  LogoutIcon: {
    h: "25px",
    w: "35px",
    mr: "2",
    color: "#3468A5",
  },
  TableText: {
    ...regular18,
    "@media (max-width: 1138px)": {
      maxW: "1px",
    },
  },
  TableTextURL: {
    ...regular18,
    "@media (max-width: 1138px)": {
      maxW: "1px",
      color: softBlue,
    },
  },
  HideOn850px: {
    ...regular18,
    "@media (max-width: 1138px)": {
      display: "none",
    },
    "@media (min-width: 1139px)": {
      display: "show",
    },
  },
  ShowOn850px: {
    "@media (min-width: 1139px)": {
      display: "none",
    },
    "@media (max-width: 1138px)": {
      display: "show",
    },
  },
};
