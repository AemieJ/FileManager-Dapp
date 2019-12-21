import React, { Component } from 'react';
import logo from '../logo.png';
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
      hashFile : "",
      account : ""
     };
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Connect to metamask');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = web3.eth.getAccounts();
    this.setState({account : accounts[0]});
    const networkId = web3.eth.net.getId();
    const networkData = FileHandler.network[networkId];
    
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
      const hash    = result[0].hash;
      this.setState({hashFile : hash});
      console.log("Ipfs result: ", result);
    });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <div class="center">
            <a
              className="navbar-brand col-sm-3 col-md-2 mr-0"
              href="http://www.github.com/AemieJ"
              target="_blank"
              rel="noopener noreferrer"
            >Ethereum with IPFS
            </a>
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                  <small className="text-white"> {this.set.accounts}</small>
              </li>
            </ul>
          </div>
        </nav><br/> <br/> <br/>
        
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="https://www.github.com/AemieJ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={`https://ipfs.infura.io/ipfs/${this.set.hashFile}`} className="App-logo" height="150px" width="120px" />
                </a>
                <p> &nbsp; </p>
                <h2> File Decentralization </h2>
                <p> &nbsp; </p>

                <form onSubmit={this.submitFile} > 
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
