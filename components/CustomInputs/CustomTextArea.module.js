import { regular14, regular9 } from 'styles/fonts'

import { darkBlue, softBlue, white } from '@/utils/colors'

export const styles = {
  CustomTextAreaContainer: {
    flexDirection: 'column',
    w: '100%',
  },
  LabelContainer: {
    ...regular9,
    color: softBlue,
  },
  FieldContainer: {
    bg: white,
    borderColor: softBlue,
    borderWidth: '1px',
    borderRadius: '8px',
    py: 0.5,
    mt: '1',
    w: '100%',
    maxH: '170px',
  },
  TextViewer: {
    ...regular14,
    color: darkBlue,
    borderWidth: '0px',
    paddingLeft: '2',
    paddingTop: '0',
    _focus: {
      borderColor: 'transparent',
      boxShadow: 'none',
    },
    maxH: '160px',
  },
}
