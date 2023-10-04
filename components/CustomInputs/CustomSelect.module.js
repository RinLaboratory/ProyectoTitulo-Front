import { regular12, regular18, regular9 } from 'styles/fonts'

import { softBlue, white } from '@/utils/colors'

export const styles = {
  MainContainer: {
    ...regular12,
    color: softBlue,
    mb: '1',
  },
  SelectContainer: {
    ...regular18,
    bg: white,
    color: 'BLACK',
    size: 'sm',
    h: '47px',
    borderColor: softBlue,
    borderWidth: '1px',
    borderRadius: '8px',
  },
  SelectIcon: {
    h: '30px',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  List: {
    ...regular12,
    color: softBlue,
  },
}
