import { softBlue, white, yellow } from "@/utils/colors";

export const styles = {
    MainContainer: {
        bgColor: '#B1FAED',
        mt: '10',
        pb: '10',
        borderRadius: '12px',
        flexDirection: 'column',
    },
    OptionContainer: {
        bgColor: '#3468A5',
        mt: '10',
        ml: '10',
        mr: '10',
        w: '992px',
        h: '168px',
        pl: '3',
        alignItems: 'center',
        borderRadius: '12px',
    },
    BigIconContainer: {
        bgColor: white,
        mr: '5',
        borderRadius: '12px',
    },
    BigIcon: {
        w: '150px',
        h: '150px',
        color: '#3468A5',
    },
    LeftOptionContainer: {
        flexDirection: 'column',
    },
    Button: {
        bg: yellow,
        color: softBlue,
        variant: 'solid',
        size: 'md',
        maxW: '150',
        justifyContent: 'flex-start',
        mt: '5',
    },
}