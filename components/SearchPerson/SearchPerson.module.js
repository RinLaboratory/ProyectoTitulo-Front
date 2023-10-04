import { softBlue, white, yellow } from "@/utils/colors";
import { regular12, regular18 } from "@/styles/fonts";

export const styles = {
    MainContainer: {
        bgColor: white,
        mt: '10',
        pb: '10',
        borderRadius: '12px',
        flexDirection: 'column',
        w: '80%'
    },
    LogoutIcon: {
        h: "25px",
        w: "35px",
        mr: '2',
        color: '#3468A5'
    },
    HeaderTextContainer: {
        flexDirection: 'row',
        mb: '30',
    },
    NameContainer: {
        flexDirection: 'column',
    },
    AreaContainer: {
        flexDirection: 'column',
        ml: '50',
    },
    HeaderText: {
        ...regular18,
    },
    ResultText: {
        ...regular12,
    },
    TableContainer: {
        bgColor: "#D9D9D9",
        p: '3',
        borderRadius: '12px',
    },
    TableText: {
        ...regular18,
        '@media (max-width: 1138px)': {
            maxW: '1px',
        },
    },
    TableTextURL: {
        ...regular18,
        '@media (max-width: 1138px)': {
            maxW: '1px',
            color: softBlue,
        },
    },
    HideOn850px: {
        ...regular18,
        '@media (max-width: 1138px)': {
            display: 'none'
        },
        '@media (min-width: 1139px)': {
            display: 'show'
        },
    },
    ShowOn850px: {
        '@media (min-width: 1139px)': {
            display: 'none'
        },
        '@media (max-width: 1138px)': {
            display: 'show'
        },
    },
}