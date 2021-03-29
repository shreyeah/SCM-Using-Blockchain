import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  Fade,
  Backdrop,
} from "@material-ui/core";
import UpdateOrder from "../forms/UpdateOrder";
import { MdEdit } from "react-icons/md";
import StatusUpdate from "../commons/StatusUpdate";
import { constants } from "../../config";
import { userAbi } from "../../abi/user.abi";
import { orderAbi } from "../../abi/order.abi";
import { productAbi } from "../../abi/product.abi";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  table: {
    minWidth: 650,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 10,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const TabPending = ({ web3, account }) => {
  const classes = useStyles();

  const [products, setProducts] = useState({});
  const [dealers, setDealers] = useState({});
  const [orders, setOrders] = useState([]);

  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState({});

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const ProductContract = new web3.eth.Contract(
      productAbi,
      constants.contractAddress.Product
    );
    const UserContract = new web3.eth.Contract(
      userAbi,
      constants.contractAddress.User
    );
    async function getData() {
      const Products = [];
      const resultProd = await ProductContract.methods
        .getTotalProducts()
        .call();
      for (let i = 1; i <= resultProd; i++) {
        const product = await ProductContract.methods.getProduct(i).call();
        Products.push(product[0]);
      }
      setProducts(Products);
      const Dealers = {};
      const resultDeal = await UserContract.methods.getTotalUsers().call();
      for (let i = 0; i < resultDeal; i++) {
        const user = await UserContract.methods.getUserByIndex(i).call();
        if (user[1] === "3") Dealers[user[3]] = user[0];
      }
      setDealers(Dealers);
    }
    getData();
  }, [web3.eth.Contract, setProducts, setDealers]);

  const updateOrder = useCallback(() => {
    const OrderContract = new web3.eth.Contract(
      orderAbi,
      constants.contractAddress.Order
    );
    function epochToTime(e) {
      const d = new Date(0);
      d.setUTCMilliseconds(e);
      return String(d);
    }
    async function getOrders() {
      const Orders = [];
      const resultOrd = await OrderContract.methods.getTotalOrders().call();
      for (let i = 1; i <= resultOrd; i++) {
        const order = await OrderContract.methods.getOrder(i).call();
        if (order[7] === "2") {
          Orders.push({
            oid: i,
            dealer: dealers[order[2]],
            createdAt: epochToTime(order[8]),
            updatedAt: epochToTime(order[9]),
            pname: products[order[0] - 1],
            quantity: order[1],
            amount: order[5],
            status: Number(order[6]),
          });
        }
      }
      Orders.reverse();
      setOrders(Orders);
    }
    getOrders();
  }, [web3.eth.Contract, setOrders, products, dealers]);

  useEffect(() => {
    updateOrder();
  }, [updateOrder]);

  return (
    <div className="container-factory-content">
      <div
        style={{
          margin: 30,
          overflow: "auto",
          maxHeight: "65vh",
        }}
      >
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ width: 24 }}></StyledTableCell>
                <StyledTableCell>OrderID</StyledTableCell>
                <StyledTableCell align="right">Dealer</StyledTableCell>
                <StyledTableCell align="right">Product Name</StyledTableCell>
                <StyledTableCell align="right">Quantity</StyledTableCell>
                <StyledTableCell align="right">Total</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
                <StyledTableCell align="right" style={{ width: 80 }}>
                  Created At
                </StyledTableCell>
                <StyledTableCell align="right" style={{ width: 80 }}>
                  Updated At
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <StyledTableRow key={order.oid}>
                  <StyledTableCell>
                    <MdEdit
                      size={20}
                      onClick={() => {
                        setDetails(order);
                        handleOpen();
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{order.oid}</StyledTableCell>
                  <StyledTableCell align="right">
                    {order.dealer}
                  </StyledTableCell>
                  <StyledTableCell align="right">{order.pname}</StyledTableCell>
                  <StyledTableCell align="right">
                    {order.quantity}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {order.amount}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <StatusUpdate status={order.status} />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {order.createdAt}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {order.updatedAt}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Modal
        aria-labelledby="place-order"
        aria-describedby="place-order-form"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <UpdateOrder
              web3={web3}
              account={account}
              oid={details.oid}
              initStatus={details.status}
              exit={handleClose}
              update={updateOrder}
            />
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

TabPending.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
};

export default TabPending;
