pragma solidity ^0.5.10;


contract Product {
    //Defining Product Structure
    struct productInfo {
        string name;
        uint256 price;
        uint256 status;
        uint256 amtInStock;
    }

    //Creating a map of id -> productInfo
    mapping(uint256 => productInfo) products;
    uint256[] productIds;

    function addProduct(string memory name, uint256 price, uint256 amtInStock)
        public
    {
        productInfo storage newProduct = products[productIds.length + 1];
        newProduct.name = name;
        newProduct.price = price;
        newProduct.status = 1;
        newProduct.amtInStock = amtInStock;
        productIds.push(productIds.length + 1);
    }

    function checkIfProductExists(uint256 pid) public view returns (bool) {
        return (pid > 0 && pid <= productIds.length);
    }

    function updateProduct(uint256 pid, uint256 price, uint256 amtInStock)
        public
    {
        if (checkIfProductExists(pid)) {
            productInfo storage p = products[pid];
            p.price = price;
            p.amtInStock = amtInStock;
        }
    }

    function updateStock(uint256 pid, uint256 amtInStock) public {
        if (checkIfProductExists(pid)) {
            productInfo storage p = products[pid];
            p.amtInStock = amtInStock;
        }
    }

    function discontinueProduct(uint256 pid) public {
        if (checkIfProductExists(pid)) {
            productInfo storage p = products[pid];
            p.status = 0;
        }
    }

    function continueProduct(uint256 pid) public {
        if (checkIfProductExists(pid)) {
            productInfo storage p = products[pid];
            p.status = 1;
        }
    }

    function getProduct(uint256 id)
        public
        view
        returns (string memory, uint256, uint256, uint256)
    {
        productInfo storage p = products[id];
        return (p.name, p.price, p.amtInStock, p.status);
    }

    function getTotalProducts() public view returns (uint256) {
        return productIds.length;
    }
}
