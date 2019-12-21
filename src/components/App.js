import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import { read } from 'fs';

const ipfsClient = require('ipfs-http-client');
//Connect to ipfs daemon API server
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: '5001',  protocol: 'https' }) 

class App extends Component {

  componentDidMount() {
    document.title = "Decentralized File System";
  }

  constructor(props) {
    super(props);
    this.state = { 
      buffer : null,
      hashFile : ""
     };
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
