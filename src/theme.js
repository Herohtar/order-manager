import { createMuiTheme } from '@material-ui/core/styles'
import { deepOrange, deepPurple, red } from '@material-ui/core/colors'

const theme = createMuiTheme({
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
})

export default theme
