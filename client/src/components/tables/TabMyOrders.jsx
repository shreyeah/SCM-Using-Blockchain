import React, { useEffect, useState } from "react";
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
  Backdrop,
  Fade,
} from "@material-ui/core";
import StatusUpdate from "../commons/StatusUpdate";
import { constants } from "../../config";
import { userAbi } from "../../abi/user.abi";
import { orderAbi } from "../../abi/order.abi";
import { rawProductAbi } from "../../abi/rawProduct.abi";
import { MdFeedback } from "react-icons/md";
import FeedbackOrder from "../forms/FeedbackOrder";

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

const TabMyOrders = ({ web3, account }) => {
  const classes = useStyles();

  const [products, setProducts] = useState({});
  const [suppliers, setSuppliers] = useState({});
  const [orders, setOrders] = useState([]);

  const [open, setOpen] = useState(false);
  const [oid, setOid] = useState({});

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const RawProductContract = new web3.eth.Contract(
      rawProductAbi,
      constants.contractAddress.RawProduct
    );
    const UserContract = new web3.eth.Contract(
      userAbi,
      constants.contractAddress.User
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
      const Suppliers = {};
      const resultSup = await UserContract.methods.getTotalUsers().call();
      for (let i = 0; i < resultSup; i++) {
        const user = await UserContract.methods.getUserByIndex(i).call();
        if (user[1] === "1") Suppliers[user[3]] = user[0];
      }
      setSuppliers(Suppliers);
    }
    getData();
  }, [web3.eth.Contract, setProducts, setSuppliers]);

  useEffect(() => {
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
        if (order[7] === "1" && order[2].toLowerCase() === account) {
          Orders.push({
            oid: i,
            supplier: suppliers[order[3]],
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
  }, [web3.eth.Contract, setOrders, products, suppliers]);

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
                <StyledTableCell>OrderID</StyledTableCell>
                <StyledTableCell align="right">Supplier</StyledTableCell>
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
                <StyledTableCell style={{ width: 24 }}></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <StyledTableRow key={order.oid}>
                  <StyledTableCell>{order.oid}</StyledTableCell>
                  <StyledTableCell align="right">
                    {order.supplier}
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
                  <StyledTableCell>
                    {order.status === 4 ? (
                      <MdFeedback
                        size={20}
                        onClick={() => {
                          setOid(order.oid);
                          handleOpen();
                        }}
                      />
                    ) : (
                      ""
                    )}
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
            <FeedbackOrder
              web3={web3}
              account={account}
              oid={oid}
              exit={handleClose}
            />
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

TabMyOrders.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
};

export default TabMyOrders;
