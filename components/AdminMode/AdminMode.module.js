import { softBlue, white, yellow } from "@/utils/colors";

export const styles = {
    MainContainer: {
        bgColor: '#B1FAED',
        mt: '10',
        pb: '10',
        borderRadius: '12px',
        flexDirection: 'column',
        '@media (max-width: 1012px)': {
            w: '417px',
        },
    },
    OptionContainer: {
        flexWrap: 'wrap',
        bgColor: '#3468A5',
        mt: '5',
        ml: '10',
        mr: '10',
        pl: '3',
        alignItems: 'center',
        borderRadius: '12px',
        '@media (max-width: 1012px)': {
            w: '337px',
            h: '288px',
        },
        '@media (min-width: 1013px)': {
            w: '892px',
            h: '148px',
        },
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
        minW: '250px',
    },
    Buttons: {
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    }
}