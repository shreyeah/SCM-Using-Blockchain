pragma solidity ^0.5.10;


contract RawProduct {
    //Defining Product Structure
    struct productInfo {
        string name;
    }

    //Creating a map of id -> productInfo
    mapping(uint256 => productInfo) products;
    uint256[] productIds;

    function addProduct(string memory name)
        public
    {
        productInfo storage newProduct = products[productIds.length + 1];
        newProduct.name = name;
        productIds.push(productIds.length + 1);
    }

    function checkIfProductExists(uint256 pid) public view returns (bool) {
        return (pid > 0 && pid <= productIds.length);
    }

    function getProduct(uint256 id)
        public
        view
        returns (string memory)
    {
        productInfo storage p = products[id];
        return (p.name);
    }

    function getTotalProducts() public view returns (uint256) {
        return productIds.length;
    }
}
