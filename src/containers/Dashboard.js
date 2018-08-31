import React from 'react'
import { SiteData, Head } from 'react-static'
import { compose } from 'recompose'
//
import withAuthorization from '../session/withAuthorization'
import { firestore } from '../firebase'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Checkbox from '@material-ui/core/Checkbox'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import OrderCard from '../components/OrderCard'
import { Flipper, Flipped } from 'react-flip-toolkit'
import YesNoDialog from '../components/YesNoDialog'

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawerPaper: {
    position: 'relative',
    width: 275,
    height: 'calc(100vh - 48px)',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  viewed: {
    fontSize: 'inherit',
  },
  unviewed: {
    fontSize: 'inherit',
    fontWeight: 700,
  },
})

class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      orders: [],
      selectedOrder: null,
      dialogOpen: false,
      dialogMessage: '',
      orderToDelete: null,
    }
  }

  componentDidMount () {
    this.unsubscribeOrdersChanged = firestore.collection('orders').orderBy('date', 'desc').onSnapshot(this.handleOrdersChanged)
  }

  componentWillUnmount() {
    clearTimeout(this.setViewedTimeout)
    this.unsubscribeOrdersChanged()
  }

  handleOrdersChanged = snapshot => {
    let orders = this.state.orders.slice()
    snapshot.docChanges().forEach(change => {
      switch (change.type) {
        case "added":
          let newOrder = { id: change.doc.id, ...change.doc.data() }
          orders.splice(change.newIndex, 0, newOrder)
          break
        case "removed":
          orders.splice(change.oldIndex, 1)
          break
        case "modified":
          orders.splice(change.oldIndex, 1)
          let modifiedOrder = { id: change.doc.id, ...change.doc.data() }
          orders.splice(change.newIndex, 0, modifiedOrder)
          break
        default:
          break
      }
    })

    let selectedOrder = null
    if (this.state.selectedOrder) {
      selectedOrder = orders.find(order => order.id == this.state.selectedOrder.id) || null
    }

    this.setState(() => ({ orders, selectedOrder }))
  }

  handleOrderClick = order => e => {
    clearTimeout(this.setViewedTimeout)

    if (!order.viewed) {
      this.setViewedTimeout = setTimeout(() => firestore.collection('orders').doc(order.id).update({ viewed: true }), 5000)
    }

    this.setState(() => ({ selectedOrder: order }))
  }

  handleDeleteClick = order => e => {
    const dialogMessage = `Are you sure you want to delete the order from ${order.name}?`
    this.setState(() => ({ dialogOpen: true, dialogMessage, orderToDelete: order.id }))
  }

  handleNo = () => {
    this.setState(() => ({ dialogOpen: false, orderToDelete: null }))
  }

  handleYes = () => {
    const { orderToDelete } = this.state
    firestore.collection('orders').doc(orderToDelete).delete()
    this.setState(() => ({ dialogOpen: false, orderToDelete: null }))
  }

  render () {
    const { classes } = this.props
    const { orders, selectedOrder, dialogOpen, dialogMessage } = this.state

    return (
      <div className={classes.root}>
        <SiteData render={({title}) => (
          <Head title={`Dashboard - ${title}`} />
        )} />
        <Drawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
          <MenuList dense>
            <Flipper flipKey={orders}>
              {orders.map(order => (
                <Flipped key={order.id} flipId={order.id}>
                  <MenuItem selected={selectedOrder == order} onClick={this.handleOrderClick(order)}>
                    <Checkbox
                      checked={!order.viewed}
                      checkedIcon={<Icon>star</Icon>}
                      icon={<Icon>done</Icon>}
                      indeterminateIcon={<Icon>star_outline</Icon>}
                      indeterminate={order.viewed && !order.completed}
                      disableRipple
                    />
                    <ListItemText
                      disableTypography
                      primary={order.name}
                      primaryTypographyProps={{className: order.viewed ? classes.viewed : classes.unviewed}}
                      secondary={order.email}
                      secondaryTypographyProps={{className: order.viewed ? classes.viewed : classes.unviewed}}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={this.handleDeleteClick(order)}>
                        <Icon>delete</Icon>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </MenuItem>
                </Flipped>
              ))}
            </Flipper>
          </MenuList>
        </Drawer>
        {selectedOrder ?
          <OrderCard order={selectedOrder} />
          :
          <div className={classes.content}>
            <Typography variant="display1" paragraph>Dashboard</Typography>
            <Typography variant="body1">No order selected.</Typography>
          </div>
        }
        <YesNoDialog open={dialogOpen} title="Delete order?" message={dialogMessage} onNo={this.handleNo} onYes={this.handleYes} />
      </div>
    )
  }
}

const authCondition = async authUser => {
  if (!authUser) {
    return false;
  }

  const token = await authUser.getIdTokenResult();
  return token.claims.hasAccess === true;
}

const enhance = compose(
  withAuthorization(authCondition),
  withStyles(styles)
)

export default enhance(Dashboard)
