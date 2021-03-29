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
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { constants } from "../../config";
import { rawProductAbi } from "../../abi/rawProduct.abi";
import AddRawProduct from "../../components/forms/AddRawProduct";

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

const FactoryRawProducts = ({ web3, account }) => {
  const classes = useStyles();
  const RawProductContract = new web3.eth.Contract(
    rawProductAbi,
    constants.contractAddress.RawProduct
  );

  const [products, setProducts] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateProducts = useCallback(async () => {
    const RawProducts = [];
    const result = await RawProductContract.methods.getTotalProducts().call();
    for (let i = 1; i <= result; i++) {
      const product = await RawProductContract.methods.getProduct(i).call();
      RawProducts.push({
        id: i,
        name: product
      });
    }
    setProducts(RawProducts);
  }, [RawProductContract, setProducts]);

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
                  <StyledTableCell>Raw Product ID</StyledTableCell>
                  <StyledTableCell align="right">Name</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <StyledTableRow key={product.id}>
                    <StyledTableCell>{product.id}</StyledTableCell>
                    <StyledTableCell align="right">{product.name}</StyledTableCell>
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
            Add Raw Product
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
            <AddRawProduct
              web3={web3}
              account={account}
              exit={handleClose}
              update={updateProducts}
            />
          </div>
        </Fade>
      </Modal>
    </>
  );
};

FactoryRawProducts.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
};

export default FactoryRawProducts;
