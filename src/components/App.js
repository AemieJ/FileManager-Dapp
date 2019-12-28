import React, { Component } from 'react';
import logo from '../logo.png';
import FileHandler from '../abis/FileHandler.json';
import './App.css';
import { read } from 'fs';
import Web3 from 'web3';
//import FileHandler from '../abis/FileHandler.json';

const ipfsClient = require('ipfs-http-client');
//Connect to ipfs daemon API server
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: '5001',  protocol: 'https' }) 

class App extends Component {

  async componentDidMount() {
    document.title = "Decentralized File System";
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  constructor(props) {
    super(props);
    this.state = { 
      buffer   : null,
      contract : null,
      hashFile : "QmP6M6YwpBDJbQoiYwTukYhec2z539Nwxva6PYMuzLiSAL",
      account : ""
     };
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});

    const networkId = await web3.eth.net.getId();
    const networkData = FileHandler.networks[networkId];
    if(networkData) {
        const abi = FileHandler.abi;
        const address = networkData.address;
        // Create a web3 representation of the contract to be able to use the functions of the smart contract FileHandler
        const contract = new web3.eth.Contract(abi, address);
        this.setState({ contract });
        const hashFile = await contract.methods.getHash().call();
        this.setState({ hashFile });

    } else {
      window.alert("Smart contract not deployed on detected network");
    }
    
  }

  async loadWeb3() {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
    } if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Use Metamask');
    }
  }


  captureFile = (event)=>{
    event.preventDefault()
    console.log("File Captured");
    // IPFS Requires file to be in format of buffer and hence we convert the file to buffer for IPFS to process
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = ()=>{
      this.setState({buffer: Buffer(reader.result)});
    }
  }

  // hash : "QmRqqE4wCB9txQpv83nNP9f5Pr7aqGTifTKbKgZhGtGHmM"
  // url  : "https://ipfs.infura.io/ipfs/QmRqqE4wCB9txQpv83nNP9f5Pr7aqGTifTKbKgZhGtGHmM"
  submitFile = (event)=>{
    event.preventDefault()
    console.log("Submitting the form");
    ipfs.add(this.state.buffer, (error, result)=> {
      if (error) {
        console.error(error);
        return;
      }
      const hashFile = result[0].hash;
      console.log("Ipfs result: ", result);

      const contract = this.state.contract;
      contract.methods.setHash(hashFile).send({from: this.state.account}, (error, transactionHash )=>{
          if(error) 
            console.error(error);
      });

    });
}

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <div className="center">
            <a
              className="navbar-brand col-sm-3 col-md-2 mr-0 text-center"
              href="http://www.github.com/AemieJ"
              target="_blank"
              rel="noopener noreferrer"
            > &nbsp; &nbsp; &nbsp; Ethereum with IPFS
            </a>
            <ul className="navbar-nav">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                  <small className="text-white"> {this.state.account } </small>
              </li>
            </ul>
          </div>
        </nav><br/> <br/> <br/>
        
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href={`https://ipfs.infura.io/ipfs/${this.state.hashFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={`${logo}`} className="App-logo" height="150px" width="120px" />
                </a>
                <p> &nbsp; </p>
                <h2> File Decentralization </h2>
                <p> &nbsp; </p>

                <form onSubmit={this.submitFile}> 
                  <input type="file" onChange={this.captureFile} /> &nbsp; &nbsp;
                  <input type="submit" />
                </form>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
