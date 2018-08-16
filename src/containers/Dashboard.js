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
import Checkbox from '@material-ui/core/Checkbox'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'
import OrderCard from '../components/OrderCard'
import { Flipper, Flipped } from 'react-flip-toolkit'

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawerPaper: {
    position: 'relative',
    width: 240,
    height: 'calc(100vh - 48px)',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
})

class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      orders: [],
      selectedOrder: null,
    }
  }

  componentDidMount () {
    this.unsubscribeOrdersChanged = firestore.collection('orders').orderBy('date', 'desc').onSnapshot(this.handleOrdersChanged)
  }

  componentWillUnmount() {
    this.unsubscribeOrdersChanged();
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
    this.setState(() => ({ selectedOrder: order }))
  }

  render () {
    const { classes } = this.props
    const { orders, selectedOrder } = this.state

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
                    <ListItemText primary={order.name} secondary={order.email} />
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
            <Typography variant="display1">Dashboard</Typography>
            <br/>
            <Typography variant="body1">No order selected.</Typography>
          </div>
        }
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
