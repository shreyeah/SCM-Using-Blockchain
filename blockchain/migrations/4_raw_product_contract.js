const RawProduct = artifacts.require("RawProduct");

module.exports = deployer => {
    deployer.deploy(RawProduct);
};