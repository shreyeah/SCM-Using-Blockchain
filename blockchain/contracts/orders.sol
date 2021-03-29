pragma solidity ^0.5.10;


contract Order {
    struct orderDetails {
        uint256 pid;
        uint256 quantity;
        address from;
        address to;
        uint256 rating;
        uint256 amount;
        uint256 status; // 0:cancelled ; 1:Placed ; 2:Shipped; 3:Completed
        uint256 otype; // supplier-factory:1 ; factory-dealer:2
        uint256 createdAt;
        uint256 updatedAt; // time in epoch
    }
    mapping(uint256 => orderDetails) orders;
    uint256[] orderIds;

    function placeOrder(
        uint256 pid,
        uint256 quantity,
        address to,
        uint256 amount,
        uint256 otype,
        uint256 createdAt
    ) public {
        uint256 id = orderIds.length + 1;
        orderDetails storage details = orders[id];

        details.pid = pid;
        details.quantity = quantity;
        details.from = msg.sender;
        details.to = to;
        details.amount = amount;
        details.otype = otype;
        details.status = 1;
        details.rating = 2;
        details.createdAt = createdAt;
        details.updatedAt = createdAt;

        orderIds.push(id);
    }

    function getOrder(uint256 ID)
        public
        view
        returns (
            uint256,
            uint256,
            address,
            address,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        orderDetails storage od = orders[ID];
        return (
            od.pid,
            od.quantity,
            od.from,
            od.to,
            od.rating,
            od.amount,
            od.status,
            od.otype,
            od.createdAt,
            od.updatedAt
        );
    }

    function getTotalOrders() public view returns (uint256) {
        return orderIds.length;
    }

    function updateStatus(
        uint256 id,
        uint256 status,
        uint256 updatedAt
    ) public {
        orders[id].status = status;
        orders[id].updatedAt = updatedAt;
    }

    function rate(uint256 id, uint256 rating) public {
        orders[id].rating = rating;
    }

    function cancelOrder(uint256 id, uint256 updatedAt) public {
        orders[id].status = 0;
        orders[id].updatedAt = updatedAt;
    }
}
