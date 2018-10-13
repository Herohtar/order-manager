import { brown, grey, deepOrange, deepPurple, red } from '@material-ui/core/colors';

export default {
  palette: {
    type: 'light',
    primary: deepPurple,
    secondary: deepOrange,
    error: red,
    background: {
      paper: deepPurple[50],
      default: deepPurple[100],
      order: deepPurple[100],
    },
  },
  typography: {
    useNextVariants: true,
  },
}
