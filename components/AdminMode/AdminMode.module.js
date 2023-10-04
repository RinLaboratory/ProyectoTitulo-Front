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
        mt: '5',
        ml: '10',
        mr: '10',
        w: '892px',
        h: '148px',
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
        w: '100%',
    },
    Button: {
        variant: 'solid',
        size: 'md',
        justifyContent: 'flex-start',
        mt: '5',
        w: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        whiteSpace: 'pre-line',
        h: 'auto',
        pt: '2',
        pb: '2',
        ml: '2',
        mr: '2',
        maxW: '250px',
    },
}