import React from 'react'
//
import { makeStyles } from '@material-ui/styles'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone'
import DoneIcon from '@material-ui/icons/Done'
import PriorityHighIcon from '@material-ui/icons/PriorityHigh'
import NewReleasesTwoToneIcon from '@material-ui/icons/NewReleasesTwoTone'
import blue from '@material-ui/core/colors/blue'
import green from '@material-ui/core/colors/green'
import orange from '@material-ui/core/colors/orange'
import { Flipper, Flipped } from 'react-flip-toolkit'

const useStyles = makeStyles(theme => ({
  viewed: {
    fontSize: 'inherit',
  },
  unviewed: {
    fontSize: 'inherit',
    fontWeight: 700,
  },
}))

const handleDeleteClick = (onDeleteClick, order) => () => {
  if (onDeleteClick) {
    onDeleteClick(order)
  }
}

const handleOrderClick = (onOrderClick, order) => () => {
  if (onOrderClick) {
    onOrderClick(order)
  }
}

const OrderList = ({ orders, selectedOrder, onDeleteClick, onOrderClick }) => {
  const classes = useStyles()

  return (
    <MenuList dense>
      <Flipper flipKey={orders}>
        {orders.map(order => (
          <Flipped key={order.id} flipId={order.id}>
            <MenuItem selected={selectedOrder == order} onClick={handleOrderClick(onOrderClick, order)}>
              <Checkbox
                checked={!order.viewed}
                checkedIcon={<NewReleasesTwoToneIcon nativeColor={blue['A400']} />}
                icon={<DoneIcon nativeColor={green['A700']} />}
                indeterminateIcon={<PriorityHighIcon nativeColor={orange['A400']} />}
                indeterminate={order.viewed && !order.completed}
                disableRipple
              />
              <ListItemText
                primary={order.name}
                primaryTypographyProps={{className: order.viewed ? classes.viewed : classes.unviewed}}
                secondary={order.email}
                secondaryTypographyProps={{className: order.viewed ? classes.viewed : classes.unviewed}}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={handleDeleteClick(onDeleteClick, order)}>
                  <DeleteTwoToneIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </MenuItem>
          </Flipped>
        ))}
      </Flipper>
    </MenuList>
  )
}

export default OrderList
