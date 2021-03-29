import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./factory.css";
import {
  Fab,
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
import { AiOutlinePlus } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { constants } from "../../config";
import { productAbi } from "../../abi/product.abi";
import AddProduct from "../../components/forms/AddProduct";
import UpdateProduct from "../../components/forms/UpdateProduct";

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

const FactoryProducts = ({ web3, account }) => {
  const classes = useStyles();

  const [products, setProducts] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [details, setDetails] = useState({});

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateOpen = () => {
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
  };

  const updateProducts = useCallback(async () => {
    const ProductContract = new web3.eth.Contract(
      productAbi,
      constants.contractAddress.Product
    );
    const Products = [];
    const result = await ProductContract.methods.getTotalProducts().call();
    console.log(result);
    for (let i = 1; i <= result; i++) {
      const product = await ProductContract.methods.getProduct(i).call();
      product.id = i;
      product.demand = Math.round(Math.random() * 100 + Math.random() * 1000);
      Products.push(product);
    }
    setProducts(Products);
  }, [setProducts, web3.eth.Contract]);

  useEffect(() => {
    updateProducts();
  }, [updateProducts]);

  return (
    <>
      <div className="container-factory-content">
        <div style={{ marginTop: 30, marginBottom: 100 }}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ width: 24 }}></StyledTableCell>
                  <StyledTableCell>PID</StyledTableCell>
                  <StyledTableCell align="right">Name</StyledTableCell>
                  <StyledTableCell align="right">
                    Price (per unit)
                  </StyledTableCell>
                  <StyledTableCell align="right">In Stock</StyledTableCell>
                  <StyledTableCell align="right">
                    Expected Demand
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <StyledTableRow key={product.id}>
                    <StyledTableCell>
                      <MdEdit
                        size={20}
                        onClick={() => {
                          setDetails(product);
                          handleUpdateOpen();
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>{product.id}</StyledTableCell>
                    <StyledTableCell align="right">
                      {product[0]}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {product[1]}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {product[2]}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {product.demand}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div style={{ position: "absolute", bottom: 10, alignSelf: "center" }}>
          <Fab
            color="primary"
            aria-label="add"
            variant="extended"
            style={{ margin: 10, backgroundColor: "#000000" }}
            onClick={handleOpen}
          >
            <AiOutlinePlus size={24} className={classes.extendedIcon} />
            Add Product
          </Fab>
        </div>
      </div>

      <Modal
        aria-labelledby="add-product"
        aria-describedby="add-product-form"
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
            <AddProduct
              web3={web3}
              account={account}
              exit={handleClose}
              update={updateProducts}
            />
          </div>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="update-price"
        aria-describedby="update-price-form"
        className={classes.modal}
        open={updateOpen}
        onClose={handleUpdateClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={updateOpen}>
          <div className={classes.paper}>
            <UpdateProduct
              web3={web3}
              account={account}
              details={details}
              exit={handleUpdateClose}
              update={updateProducts}
            />
          </div>
        </Fade>
      </Modal>
    </>
  );
};

FactoryProducts.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
};

export default FactoryProducts;
