const Product = artifacts.require("Product");

module.exports = deployer => {
    deployer.deploy(Product);
};