// deployed at 0xa872Ea12BE8CFA4D56dAd9021D94250B82786441
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import from node_modules @openzeppelin/contracts v4.0
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/** 
  *@title TeaParty contract
*/
contract TeaParty is Ownable, ReentrancyGuard {
    // create a mpping of address to uint
    mapping(address => uint) private _teaPartyTransactions;
    // create a variable to hold the number of open transactions
    uint private _openTransactions;

    /** 
      * @param amount (type uint256) amount of ether
      * @dev function use to withdraw ether from contract
    */
    function withdraw(uint256 amount) public onlyOwner returns (bool success) {
      require(amount <= address(this).balance, "withdraw: function withdraw invalid input");
      payable(_msgSender()).transfer(amount);
      return true;
    }


    /** 
      * @dev function use to deposit ether into contract
    */
    function purchaseTransaction() public payable returns (uint transactionID){
      require(msg.sender.balance >= msg.value && msg.value != 0 ether, "invalid input");
      // create and return a random 
      uint test = rnd();
      // add the random number to the mapping
      _teaPartyTransactions[msg.sender] = test;
      // increment the number of open transactions
      _openTransactions++;
      return test;
    }


    /** 
      * @dev function use to get the transaction from the mapping
      * @param transaction (type address) address of the transaction
    */
    function getTeaTransactions(address transaction) public onlyOwner view returns (uint) {
      return _teaPartyTransactions[transaction];
    }

    /** 
      * @dev function use for users to retrieve their transaction ID from the mapping
    */
    function getTeaTransactionByAddress() public view returns (uint) {
      return _teaPartyTransactions[msg.sender];
    }

    // remove a specific transaction from the mapping
    function removeTeaTransaction(address transaction) public onlyOwner returns (bool success) {
      delete _teaPartyTransactions[transaction];
      _openTransactions--;
      return true;
    }

  
    // rnd() is a private function that returns a random number between 0 and 10000000000000
    function rnd() private view returns(uint){
        return  uint (keccak256(abi.encode(block.timestamp,  10000000000000)));
    }

}