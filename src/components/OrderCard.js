import React from 'react'
//
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: 'calc(100vh - 48px)',
    overflow: 'auto',
  },
})

const OrderCard = ({ classes, order }) => (
  <Paper className={classes.root} square>
    <Typography variant="display1" paragraph>Order</Typography>
    <Typography variant="body2">Name:</Typography>
    <Typography variant="body1" paragraph>{order.name}</Typography>
    <Typography variant="body2">Email:</Typography>
    <Typography variant="body1" paragraph>{order.email}</Typography>
    <Typography variant="body2">Delivery requested:</Typography>
    <Typography variant="body1" paragraph>{order.delivery}</Typography>
    {order.delivery == "yes" && (
      <React.Fragment>
        <Typography variant="body2">Address:</Typography>
        <Typography variant="body1" paragraph>{order.address}</Typography>
      </React.Fragment>
    )}
    <Typography variant="subheading" paragraph>Products</Typography>
    {order.products.map(product => (
      <React.Fragment key={product.name}>
        <Typography variant="body2">{product.name}</Typography>
        <Typography variant="body1" paragraph>Amount: {product.amount}</Typography>
      </React.Fragment>
    ))}
  </Paper>
)

export default withStyles(styles)(OrderCard)
