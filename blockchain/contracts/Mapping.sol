pragma solidity ^0.5.10;


contract Mapping {
    struct supplierRawProduct {
        address sid;
        uint256 rpid;
        uint256 price;
    }
    mapping(uint256 => supplierRawProduct) srp;
    uint256[] srpIds;

    struct productRawProduct {
        uint256 pid;
        uint256 rpid;
    }
    mapping(uint256 => productRawProduct) prp;
    uint256[] prpIds;

    function mapSupplierToRawProduct(uint256 rpid, uint256 price)
        public
    {
        uint256 id = srpIds.length + 1;
        supplierRawProduct storage m = srp[id];

        m.sid = msg.sender;
        m.rpid = rpid;
        m.price = price;

        srpIds.push(id);
    }

    function mapProductToRawProduct(uint256 pid, uint256 rpid) public {
        uint256 id = prpIds.length + 1;
        productRawProduct storage m = prp[id];

        m.pid = pid;
        m.rpid = rpid;

        prpIds.push(id);
    }

    function getTotalSRPMappings() public view returns (uint256) {
        if (srpIds.length == 0) return 0;
        return srpIds.length;
    }

    function getTotalPRPMappings() public view returns (uint256) {
        if (prpIds.length == 0) return 0;
        return prpIds.length;
    }

    function getSRPMapping(uint256 id)
        public
        view
        returns (address, uint256, uint256)
    {
        supplierRawProduct storage m = srp[id];
        return (m.sid, m.rpid, m.price);
    }

    function getPRPMapping(uint256 id) public view returns (uint256, uint256) {
        productRawProduct storage m = prp[id];
        return (m.pid, m.rpid);
    }

    function updateSRPMapping(uint id, uint price) public{
        supplierRawProduct storage m = srp[id];
        m.price = price;
    }
}
