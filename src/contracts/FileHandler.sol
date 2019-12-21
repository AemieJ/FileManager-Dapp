pragma solidity ^0.5.0;

contract FileHandler { 

  string hashFile = "";

  function setHash(string memory _hash) public {
    hashFile = _hash;
  }

  function getHash() public view returns (string memory) {
    return hashFile;
  }

}