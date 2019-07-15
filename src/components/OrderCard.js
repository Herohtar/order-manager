import React from 'react'
//
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Moment from 'react-moment'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
    height: 'calc(100vh - 48px)',
    overflow: 'auto',
    background: theme.palette.background.order,
  },
}))

export default ({ order, onToggleCompleted }) => {
  const classes = useStyles()
  return (
    <Paper className={classes.root} square>
      <Grid container>
        <Grid item xs>
          <Typography variant="h5" paragraph>{order.name} on <Moment date={order.date.toDate()} format="dddd, MMMM Do, YYYY" /></Typography>
          <Typography variant="body1">Email:</Typography>
          <Typography variant="body2" paragraph>{order.email}</Typography>
          <Typography variant="body1">Delivery requested:</Typography>
          <Typography variant="body2" paragraph>{order.delivery}</Typography>
          {order.delivery == "yes" && (
            <>
              <Typography variant="body1">Address:</Typography>
              <Typography variant="body2" paragraph>{order.address}</Typography>
            </>
          )}
          <Typography variant="subtitle1" paragraph>Products</Typography>
          {order.products.map(product => (
            <React.Fragment key={product.name}>
              <Typography variant="body1">{product.name}</Typography>
              <Typography variant="body2" paragraph>Amount: {product.amount}</Typography>
            </React.Fragment>
          ))}
        </Grid>
        <Grid item xs="auto">
          <Button variant="outlined" onClick={onToggleCompleted}>{order.completed ? 'Mark as incomplete' : 'Mark as completed'}</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}
