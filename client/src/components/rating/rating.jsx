import React, { useEffect } from "react";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { orderAbi } from "../../abi/order.abi";
import { constants } from "../../config";

import "../rating/rating.css";

const SRating = ({ web3, account }) => {
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    const OrderContract = new web3.eth.Contract(
      orderAbi,
      constants.contractAddress.Order
    );
    async function calcRating() {
      try {
        const resultOrd = await OrderContract.methods.getTotalOrders().call();
        const Orders = [];
        for (let i = 1; i <= resultOrd; i++) {
          const order = await OrderContract.methods.getOrder(i).call();
          if (order[3].toLowerCase() === account) Orders.push(order);
        }
        console.log(Orders);
        Orders.sort((x, y) => (x[9] < y[9] ? 1 : y[9] < x[9] ? -1 : 0));
        let r = 0;
        for (let i = 0; i < Math.min(5,Orders.length); i++) {
          r += Number(Orders[i][4])
        }
        setValue(r/Math.min(5,Orders.length))
      } catch (e) {
        console.log(e);
      }
    }
    calcRating();
  }, [web3.eth.Contract]);

  return (
    <div>
      <Box component="fieldset" mb={3} borderColor="transparent">
        <div className="ratingcontainer">
          <Typography component="legend">Your Rating</Typography>
          <Rating name="read-only" value={value} readOnly />
        </div>
      </Box>
    </div>
  );
};

SRating.propTypes = {
  web3: PropTypes.object,
  account: PropTypes.string,
};

export default SRating;
