// https://github.com/JodusNodus/react-qr-reader

import React, { Component } from 'react'
import QrReader from 'react-qr-scanner'

class Scanner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showScanner: true,
      delay: 100,
    }

    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  handleScan(data) {
    if (data != null) {
      console.log("scanned Data: " + data)
      this.setState({
        showScanner: false,
        result: data,
      })
    }
  }

  handleError(err) {
    console.error(err)
  }

  render() {
    const previewStyle = {
      height: 400,
      width: 400,
    }

    return (
      <div>
        <p>Please scan the QR code shown in the read application</p>
        {this.state.showScanner === true ? (
          <QrReader
            delay={this.state.delay}
            style={previewStyle}
            onError={this.handleError}
            onScan={this.handleScan}
            facingMode={this.environment}
          />
        ) : (
            <p>{this.state.result}</p>
          )}
      </div>
    )
  }
}

export default Scanner;