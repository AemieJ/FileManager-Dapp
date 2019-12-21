const FileHandler = artifacts.require('FileHandler');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('FileHandler', (accounts)=>{
  let hashFile;

  before( async()=>{
    hashFile = await FileHandler.deployed();
  });

  describe('Deployment Check', async()=>{
    it('Deploy successful', async()=>{
      const address = hashFile.address;
      assert.notEqual(address, 0x0, 'token must not have zero address');
      assert.notEqual(address, '', 'token must not be empty string');
      assert.notEqual(address, null, 'token must not be null');
      assert.notEqual(address, undefined, 'token must not be undefined');
    })
  });

  describe('Storage of hashFile Check', async()=>{
    it('Storage of hash successful', async()=>{
      let hashValue = 'randomHash';
      await hashFile.set(hashValue);
      const result  = await hashFile.get();
      assert.equal(result, hashValue, 'hash has been correctly stored on the blockchain');
    })
  });
  
})