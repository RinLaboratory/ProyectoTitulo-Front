import { softBlue } from '@/utils/colors'

export const styles = {
  NavBarContainer: {
    bgColor: softBlue,
    w: '100%',
    color: 'white',
    justifyContent: 'center',
    p: 4,
  },
  UserIcon: {
    h: "50px",
    w: "50px",
    mr: '2',
  },
  LogoutIcon: {
    h: "25px",
    w: "25px",
    mr: '2',
  },
  ButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'start',
  },
  Button: {
    variant: 'solid',
    size: 'md',
    justifyContent: 'flex-start',
  },
  UserInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyItems: 'center',
    mr: '8',
  },
  LogoutContainer: {
    display: 'flex',
    alignItems: 'center',
    mr: '2',
  },
  NavBarPosition: {
    w: '1500px',
    px: '50px',
  },
}
