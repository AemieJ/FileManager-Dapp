const FileHandler = artifacts.require("FileHandler");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('FileHandler', (accounts)=>{

  let hashFile;

  before( async() =>{
    hashFile = await FileHandler.deployed();
  });

  describe('Check for deployment', async()=>{
      it('Deployment successfull', async()=> {
          const address = hashFile.address;
          assert.notEqual(address, null, 'Address is not null');
          assert.notEqual(address, undefined, 'Address is not undefined');
          assert.notEqual(address, 0x0, 'Address is not just 0 address');
          assert.notEqual(address, '', 'Address is not empty string');
      });
  });

  describe('Check for blockchain functions', async()=>{
    it('Sets and updates the hash for ipfs correctly', async()=>{
        let hashKey = "aba32193jwgwe";
        await hashFile.setHash(hashKey);

        let getHash = await hashFile.getHash();
        assert.equal(getHash, hashKey, 'hash key has been set and returned successfully');
    });
  });


})