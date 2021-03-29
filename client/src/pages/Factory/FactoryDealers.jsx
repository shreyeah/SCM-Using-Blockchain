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
import { userAbi } from "../../abi/user.abi";
import AddUser from "../../components/forms/AddUser";
import UpdateUser from "../../components/forms/UpdateUser";

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

const FactoryDealers = ({ web3, account }) => {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [dealers, setDealers] = useState([]);
  const [updateDetails, setUpdateDetails] = useState({});

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateHandleOpen = () => {
    setUpdateOpen(true);
  };

  const updateHandleClose = () => {
    setUpdateOpen(false);
  };

  const classes = useStyles();

  const UserContract = new web3.eth.Contract(
    userAbi,
    constants.contractAddress.User
  );
  const updateDealer = useCallback(async () => {
    const Dealers = [];
    const result = await UserContract.methods.getTotalUsers().call();
    for (let i = 0; i < result; i++) {
      const user = await UserContract.methods.getUserByIndex(i).call();
      if (user[1] === "3") {
        Dealers.push(user);
      }
    }
    setDealers(Dealers);
  }, [UserContract, setDealers]);

  useEffect(() => {
    updateDealer();
  }, [updateDealer]);

  return (
    <>
      <div className="container-factory-content">
        <div style={{ marginTop: 30, marginBottom: 100 }}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ width: 24 }}></StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="right">
                    Contact Number
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    Wallet Address
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dealers.map((dealer) => (
                  <StyledTableRow key={dealer[3]}>
                    <StyledTableCell>
                      <MdEdit
                        size={20}
                        onClick={() => {
                          setUpdateDetails(dealer);
                          updateHandleOpen();
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>{dealer[0]}</StyledTableCell>
                    <StyledTableCell align="right">{dealer[2]}</StyledTableCell>
                    <StyledTableCell align="right">{dealer[3]}</StyledTableCell>
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
            <AiOutlinePlus size={24}  className={classes.extendedIcon} />
            Add Dealer
          </Fab>
        </div>
      </div>

      <Modal
        aria-labelledby="add-dealer"
        aria-describedby="add-dealer-form"
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
            <AddUser
              web3={web3}
              account={account}
              type="Dealer"
              update={updateDealer}
              exit={handleClose}
            />
          </div>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="update-dealer"
        aria-describedby="update-dealer-form"
        className={classes.modal}
        open={updateOpen}
        onClose={updateHandleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={updateOpen}>
          <div className={classes.paper}>
            <UpdateUser
              web3={web3}
              account={account}
              userDetails={{
                name: updateDetails[0],
                phno: updateDetails[2],
                address: updateDetails[3],
              }}
              update={updateDealer}
              exit={updateHandleClose}
            />
          </div>
        </Fade>
      </Modal>
    </>
  );
};

FactoryDealers.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
};

export default FactoryDealers;
