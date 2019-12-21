const  FileHandler = artifacts.require("FileHandler");

module.exports = function(deployer) {
  deployer.deploy(FileHandler);
};
