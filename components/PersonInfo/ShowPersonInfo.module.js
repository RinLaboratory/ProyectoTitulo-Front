import { softBlue, white, yellow } from "@/utils/colors";

export const styles = {
    MainContainer: {
        bgColor: white,
        mt: '10',
        pb: '10',
        borderRadius: '12px',
        flexDirection: 'column',
    },
    Button: {
        variant: 'solid',
        size: 'md',
        justifyContent: 'flex-start',
        mt: '5',
    },
    LogoutIcon: {
        h: "230px",
        w: "230px",
        mr: '2',
        color: '#3468A5'
    },
    InputContainer: {
        flexDirection: 'column',
        w: '417px',
    },
    InputSection: {
        mb: '30',
        gap: '8',
        flexWrap: 'wrap',
        '@media (max-width: 1138px)': {
            flexDirection: 'column',
        },
        '@media (min-width: 1138px)': {
            flexDirection: 'row',
        },
    },
    InputLarge: {
        flexDirection: 'column',
        '@media (max-width: 1138px)': {
            w: '417px',
        },
        '@media (min-width: 1138px)': {
            w: '866px',
        },
    },
    ChangePos: {
        flexDirection: 'row',
        mt: '8',
        gap: '6',
        '@media (max-width: 1138px)': {
            flexDirection: 'column'
        },
        '@media (min-width: 1138px)': {
            flexDirection: 'row'
        },
    }
}