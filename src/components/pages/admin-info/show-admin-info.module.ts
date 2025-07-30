import { white } from "~/utils/colors";

export const styles = {
  MainContainer: {
    bgColor: white,
    mt: "10",
    pb: "10",
    borderRadius: "12px",
    flexDirection: "column",
    alignContents: "center",
  },
  OptionContainer: {
    bgColor: "#3468A5",
    mt: "10",
    ml: "10",
    mr: "10",
    w: "992px",
    h: "168px",
    pl: "3",
    alignItems: "center",
    borderRadius: "12px",
  },
  BigIconContainer: {
    bgColor: white,
    mr: "5",
    borderRadius: "12px",
  },
  BigIcon: {
    w: "150px",
    h: "150px",
    color: "#3468A5",
  },
  LeftOptionContainer: {
    flexDirection: "column",
  },
  Button: {
    variant: "solid",
    size: "md",
    justifyContent: "flex-start",
    mt: "5",
    w: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    whiteSpace: "pre-line",
    h: "auto",
    pt: "2",
    pb: "2",
  },
  LogoutIcon: {
    h: "230px",
    w: "230px",
    mr: "2",
    color: "#3468A5",
  },
};
