import React, { useState, useEffect } from 'react'
import { Head, useSiteData } from 'react-static'
//
import withAuthorization from '../session/withAuthorization'
import { firestore } from '../firebase'
import { makeStyles } from '@material-ui/styles'
import Drawer from '@material-ui/core/Drawer'
import OrderList from '../components/OrderList'
import Typography from '@material-ui/core/Typography'
import OrderCard from '../components/OrderCard'
import YesNoDialog from '../components/YesNoDialog'

const useStyles = makeStyles(theme => ({
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
    padding: theme.spacing(3),
  },
}))


const authCondition = async authUser => {
  if (!authUser) {
    return false;
  }

  const token = await authUser.getIdTokenResult();
  return token.claims.hasAccess === true;
}

export default withAuthorization(authCondition)(props => {
  const classes = useStyles()
  const { title } = useSiteData()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [orderToDelete, setOrderToDelete] = useState(null)

  let setViewedTimeout = 0

  useEffect(() => {
    const handleOrdersChanged = snapshot => {
      let newOrders = orders.slice()
      snapshot.docChanges().forEach(change => {
        switch (change.type) {
          case "added":
            let newOrder = { id: change.doc.id, ...change.doc.data() }
            newOrders.splice(change.newIndex, 0, newOrder)
            break
          case "removed":
            newOrders.splice(change.oldIndex, 1)
            break
          case "modified":
            newOrders.splice(change.oldIndex, 1)
            let modifiedOrder = { id: change.doc.id, ...change.doc.data() }
            newOrders.splice(change.newIndex, 0, modifiedOrder)
            break
          default:
            break
        }
      })

      if (selectedOrder) {
        setSelectedOrder(newOrders.find(order => order.id == selectedOrder.id) || null)
      }

      setOrders(newOrders)
    }

    const unsubscribeOrdersChanged = firestore.collection('orders').orderBy('date', 'desc').onSnapshot(handleOrdersChanged)

    return () => {
      clearTimeout(setViewedTimeout)
      unsubscribeOrdersChanged()
    }
  })

  const handleOrderClick = order => {
    clearTimeout(setViewedTimeout)

    if (!order.viewed) {
      setViewedTimeout = setTimeout(() => firestore.collection('orders').doc(order.id).update({ viewed: true }), 5000)
    }

    setSelectedOrder(order)
  }

  const handleDeleteClick = order => {
    setDialogMessage(`Are you sure you want to delete the order from ${order.name}?`)
    setOrderToDelete(order.id)
    setDialogOpen(true)
  }

  const handleNo = () => {
    setDialogOpen(false)
    setOrderToDelete(null)
  }

  const handleYes = () => {
    firestore.collection('orders').doc(orderToDelete).delete()
    setDialogOpen(false)
    setOrderToDelete(null)
  }

  const handleToggleCompleted = () => {
    firestore.collection('orders').doc(selectedOrder.id).update({ completed: !selectedOrder.completed })
  }

  return (
    <div className={classes.root}>
      <Head title={`Dashboard - ${title}`} />
      <Drawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
        <OrderList
          orders={orders}
          selectedOrder={selectedOrder}
          onOrderClick={handleOrderClick}
          onDeleteClick={handleDeleteClick}
        />
      </Drawer>
      {selectedOrder ?
        <OrderCard order={selectedOrder} onToggleCompleted={handleToggleCompleted} />
        :
        <div className={classes.content}>
          <Typography variant="h4" paragraph>Dashboard</Typography>
          <Typography variant="body2">No order selected.</Typography>
        </div>
      }
      <YesNoDialog open={dialogOpen} title="Delete order?" message={dialogMessage} onNo={handleNo} onYes={handleYes} />
    </div>
  )
})
