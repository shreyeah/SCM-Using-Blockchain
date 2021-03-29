import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./Supplier.css";
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
import AddProduct from "../../components/forms/AddProductSupplier";
import { rawProductAbi } from "../../abi/rawProduct.abi";
import { mappingAbi } from "../../abi/mapping.abi";
import { constants } from "../../config";

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

const SupplierProducts = ({ web3, account }) => {
  const classes = useStyles();

  const MappingContract = new web3.eth.Contract(
    mappingAbi,
    constants.contractAddress.Mapping
  );

  const [products, setProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);

  const updateProducts = useCallback(async () => {
    const Products = [];
    const result = await MappingContract.methods.getTotalSRPMappings().call();
    for (let i = 1; i <= result; i++) {
      const mapping = await MappingContract.methods.getSRPMapping(i).call();
      if (mapping[0].toLowerCase() === account) {
        Products.push({
          ...products[mapping[1]-1],
          price: mapping[2],
        });
      }
    }
    setMyProducts(Products);
  }, [setMyProducts, account, products, MappingContract.methods]);

  useEffect(() => {
    const RawProductContract = new web3.eth.Contract(
      rawProductAbi,
      constants.contractAddress.RawProduct
    );

    async function getProducts() {
      const Products = [];
      const result = await RawProductContract.methods.getTotalProducts().call();
      for (let i = 1; i <= result; i++) {
        const product = await RawProductContract.methods.getProduct(i).call();
        Products.push({
          id: i,
          name: product,
        });
      }
      setProducts(Products);
    }
    getProducts();
  }, [setProducts, web3.eth.Contract]);

  useEffect(() => {
    updateProducts();
  }, [updateProducts]);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="container-factory-content">
        <div style={{ marginTop: 30, marginBottom: 100 }}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>PID</StyledTableCell>
                  <StyledTableCell align="right">Name</StyledTableCell>
                  <StyledTableCell align="right">
                    Price (per unit)
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myProducts.map((product) => (
                  <StyledTableRow key={product.id}>
                    <StyledTableCell>{product.id}</StyledTableCell>
                    <StyledTableCell align="right">
                      {product.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {product.price}
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
              products={products}
              exit={handleClose}
              update={updateProducts}
            />
          </div>
        </Fade>
      </Modal>
    </>
  );
};

SupplierProducts.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
};

export default SupplierProducts;
