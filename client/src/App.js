import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Factory from "./pages/Factory/Factory";
import Supplier from "./pages/Supplier/Supplier";
import Dealer from "./pages/Dealer/Dealer";
import { constants } from "./config";
import { userAbi } from "./abi/user.abi";
import Welcome from "./components/loaders/wel";
import Error from "./components/loaders/error";

const web3 = new Web3(Web3.givenProvider);

function App() {
  const [account, setAccount] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [userType, setUserType] = useState(0);

  useEffect(() => {
    const UserContract = new web3.eth.Contract(
      userAbi,
      constants.contractAddress.User
    );
    async function initialize() {
      setLoading(true);
      try {
        const accounts = await window.ethereum.enable();
        setAccount(accounts[0]);
        const isFirstRun = await UserContract.methods.isFirstRun().call();
        console.log(isFirstRun);
        if (isFirstRun) {
          const gas = await UserContract.methods
            .setup("admin", 7325648521)
            .estimateGas();
          const result = await UserContract.methods
            .setup("admin", 7325648521)
            .send({
              from: accounts[0],
              gas,
            });
          console.log(result);
        }
        const result = await UserContract.methods.getUser(accounts[0]).call();
        console.log(result);
        setUserType(result[1]);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [setAccount, setUserType]);

  const Home = () => {
    switch (userType) {
      case "1":
        return <Supplier web3={web3} account={account} />;
      case "2":
        return <Factory web3={web3} account={account} />;
      case "3":
        return <Dealer web3={web3} account={account} />;
      default:
        return <Error />;
    }
  };
  return <>{isLoading ? <Welcome /> : <Home />}</>;
}

export default App;
