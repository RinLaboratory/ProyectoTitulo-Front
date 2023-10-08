import { softBlue, white, yellow } from "@/utils/colors";

export const styles = {
    MainContainer: {
        bgColor: white,
        borderRadius: '12px',
        flexDirection: 'column',
    },
    LogoutIcon: {
        h: "230px",
        w: "230px",
        mr: '2',
        color: '#3468A5'
      },
    CustomInput: {
        flexDirection: 'column',
        w: '400px',
        mb: '30',
    },
    ProfilePicture: {
        flexDirection: 'column',
        mr: '5',
        alignItems: 'center',
        alignContent: 'center',
        '@media (max-width: 796px)': {
            display: 'none'
        },
    }
}