// https://github.com/kybarg/react-qr-scanner#readme

import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import { Link, Redirect } from "react-router-dom";

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
      console.log("Scanned Data: " + data)
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
          <QrReader
            delay={100}
            onError={this.handleError}
            onScan={this.handleScan}
            onLoad={this.onLoad}
            style={{ width: '100%' }}
            facingMode={this.environment}
            showViewFinder={false}
          />

        </div>
        <div hidden={this.state.showScanner}>
          <Link to={{ pathname: '/result', data: this.state.data }}>
            <button disabled={this.state.showScanner}>View Result</button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Scanner;