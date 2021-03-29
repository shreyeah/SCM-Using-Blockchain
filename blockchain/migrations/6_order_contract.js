const Order = artifacts.require("Order");

module.exports = deployer => {
    deployer.deploy(Order);
};