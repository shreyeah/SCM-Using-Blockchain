import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  TableCell,
  TableRow,
  Table,
  TableHead,
  TableContainer,
  TableBody,
  Paper,
  Modal,
  Backdrop,
  Fade,
} from "@material-ui/core";
import UpdateOrder from "../../components/forms/UpdateOrder";
import StatusUpdate from "../../components/commons/StatusUpdate";
import { orderAbi } from "../../abi/order.abi";
import { constants } from "../../config";
import { rawProductAbi } from "../../abi/rawProduct.abi";
import { MdEdit } from "react-icons/md";

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

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
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

const SupplierOrders = ({ web3, account }) => {
  const classes = useStyles();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState({});

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function epochToTime(e) {
    const d = new Date(0);
    d.setUTCMilliseconds(e);
    return String(d);
  }

  useEffect(() => {
    const RawProductContract = new web3.eth.Contract(
      rawProductAbi,
      constants.contractAddress.RawProduct
    );
    async function getData() {
      const Products = [];
      const resultProd = await RawProductContract.methods
        .getTotalProducts()
        .call();
      for (let i = 1; i <= resultProd; i++) {
        const product = await RawProductContract.methods.getProduct(i).call();
        Products.push(product);
      }
      setProducts(Products);
    }
    getData();
  }, [setProducts, web3.eth.Contract]);

  const updateOrders = useCallback(() => {
    const OrderContract = new web3.eth.Contract(
      orderAbi,
      constants.contractAddress.Order
    );
    async function getData() {
      const Orders = [];
      const result = await OrderContract.methods.getTotalOrders().call();
      for (let i = 1; i <= result; i++) {
        const order = await OrderContract.methods.getOrder(i).call();
        if (order[3].toLowerCase() === account) {
          order.id = i;
          order.product = products[order[0] - 1];
          Orders.push(order);
        }
      }
      Orders.reverse();
      setOrders(Orders);
    }
    getData();
  }, [setOrders, account, products, web3.eth.Contract]);

  useEffect(() => {
    updateOrders();
  }, [updateOrders]);

  return (
    <>
      <div
        style={{
          margin: 40,
          overflow: "auto",
          maxHeight: "75vh",
        }}
      >
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ width: 24 }}></StyledTableCell>
                <StyledTableCell>Order ID</StyledTableCell>
                <StyledTableCell align="right">Product</StyledTableCell>
                <StyledTableCell align="right">Quantity</StyledTableCell>
                <StyledTableCell align="right">Amount</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
                <StyledTableCell align="right" style={{ width: 100 }}>
                  Created At
                </StyledTableCell>
                <StyledTableCell align="right" style={{ width: 100 }}>
                  Updated At
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <StyledTableRow key={order.id}>
                  <StyledTableCell>
                    <MdEdit
                      size={20}
                      onClick={() => {
                        setDetails(order);
                        handleOpen();
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{order.id}</StyledTableCell>
                  <StyledTableCell align="right">
                    {order.product}
                  </StyledTableCell>
                  <StyledTableCell align="right">{order[1]}</StyledTableCell>
                  <StyledTableCell align="right">{order[5]}</StyledTableCell>
                  <StyledTableCell align="right">
                    <StatusUpdate status={Number(order[6])} />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {epochToTime(order[8])}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {epochToTime(order[9])}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
                oid={details.id}
                initStatus={Number(details[6])}
                exit={handleClose}
                update={updateOrders}
              />
            </div>
          </Fade>
        </Modal>
      </div>
    </>
  );
};

SupplierOrders.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
};

export default SupplierOrders;
