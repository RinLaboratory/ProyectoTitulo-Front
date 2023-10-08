import { softBlue, white, yellow } from "@/utils/colors";

export const styles = {
    MainContainer: {
        bgColor: white,
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
    LeftOptionContainer: {
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
        w: '350px',
    },
    InputContainerLeft: {
        flexDirection: 'column',
        w: '350px',
        '@media (min-width: 1168px)': {
            ml: '50',
        },
    },
    BothInputs: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        mb: '30',
        '@media (max-width: 1169px)': {
            w: '358px',
        },
    },
    InputHouse: {
        flexDirection: 'column',
        w: '750px',
    },
    ProfilePic: {
        '@media (max-width: 1169px)': {
            display: 'none',
        },
        bgColor: '#D9D9D9'
    },
    rutProfile: {
        flexDirection: 'column',
        mr: '5',
        alignItems: 'center',
        alignContent: 'center',
        '@media (max-width: 1168px)': {
            w: '350px',
        },
    },
    asd: {
        mt: '3',
        '@media (min-width: 1168px)': {
            flexDirection: 'row',
        },
        '@media (max-width: 1169px)': {
            flexDirection: 'column',
        },
    }
}