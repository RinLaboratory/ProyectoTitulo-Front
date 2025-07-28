import { white } from "~/utils/colors";

export const styles = {
  MainContainer: {
    justifyContent: "center",
    alignItems: "center",
    h: "400px",
    mt: "10",
    pb: "10",
    borderRadius: "12px",
    flexDirection: "column",
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
  },
};
