import { softBlue, white, yellow } from "@/utils/colors";
import { regular12, regular18 } from "@/styles/fonts";

export const styles = {
    TableText: {
        ...regular18,
        '@media (max-width: 850px)': {
            maxW: '1px',
        },
    },
    TableTextURL: {
        ...regular18,
        '@media (max-width: 850px)': {
            maxW: '1px',
            color: softBlue,
        },
    },
    HideOn850px: {
        ...regular18,
        '@media (max-width: 850px)': {
            display: 'none'
        },
        '@media (min-width: 851px)': {
            display: 'show'
        },
    },
    ShowOn850px: {
        '@media (min-width: 851px)': {
            display: 'none'
        },
        '@media (max-width: 850px)': {
            display: 'show'
        },
    },
    LogoutIcon: {
        h: "25px",
        w: "35px",
        mr: '2',
        color: '#3468A5'
      },
}