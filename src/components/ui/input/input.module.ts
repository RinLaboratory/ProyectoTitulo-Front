import { regular14 } from "~/styles/fonts";

import { darkBlue, softBlue, white } from "~/utils/colors";
import { regular12 } from "~/styles/fonts";

export const styles = {
  LabelContainer: {
    ...regular12,
    color: softBlue,
  },
  FieldContainer: {
    bg: white,
    borderColor: softBlue,
    borderWidth: "1px",
    borderRadius: "8px",
    py: 0.5,
    mt: "1",
    w: "100%",
    position: "relative",
  },
  FieldEdit: {
    w: "90%",
  },
  TextViewer: {
    ...regular14,
    color: darkBlue,
    borderWidth: "0px",
    paddingLeft: "2",
    height: "var(--chakra-sizes-8)",
    _focus: {
      borderColor: "transparent",
      boxShadow: "none",
    },
  },
  TextRightContainer: {
    position: "absolute",
    right: "2",
    bottom: "1",
    top: "1",
    alignItems: "center",
    cursor: "pointer",
  },
  EditImage: {
    w: "25px",
    h: "25px",
  },
};
