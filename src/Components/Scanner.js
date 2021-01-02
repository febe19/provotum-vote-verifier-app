// https://github.com/kybarg/react-qr-scanner#readme

import React, { Component } from 'react'
import QRCodeScanner from './../HelperFunctions/QRScanner.js'
import { Link } from "react-router-dom";

class Scanner extends Component {
  constructor(props) {
    super(props)
    console.log(props.showScanner)
    this.state = {
      data: null,
      showScanner: true,
    }
  }

  handleScan = data => {
    if (data) {
      this.setState({
        data: data,
        showScanner: false
      })
    }
  }

  handleError = err => {
    console.error(err)
  }

  render() {
    return (
      <div>
        <div style={this.state.showScanner ? {} : { display: 'none' }}>
          <QRCodeScanner onScan={this.handleScan}/>
        </div>
        <div hidden={this.state.showScanner}>
          <Link to={{ pathname: '/result', qrdata: this.state.data }}>
            <button disabled={this.state.showScanner}>View Result</button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Scanner;