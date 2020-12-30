// https://github.com/kybarg/react-qr-scanner#readme

import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import { Redirect } from "react-router-dom";

class Scanner extends Component {
  constructor(props) {
    super(props)
    console.log(props.showScanner)
    this.state = {
      result: null,
      showScanner: true,
    }

  }

  handleScan = data => {
    if (data) {
      console.log("Scanned Data: " + data)
      this.setState({
        result: data,
        showScanner: false
      })
    }
  }

  handleError = err => {
    console.error(err)
  }


  componentWillUnmount() {
    console.log("Scanner will Unmount")
    return null
  }

  render() {

    if (this.state.result) {
      return <Redirect to={{pathname: "/result", state: this.state.result}} />
    } else {
      return (
        <div style={this.state.showScanner ? {} : {display: 'none'} }>
          <QrReader
            delay={100}
            onError={this.handleError}
            onScan={this.handleScan}
            onLoad={this.onLoad}
            style={{ width: '100%' }}
            facingMode={this.environment}
            showViewFinder={false}
          />
          <p>{this.state.result}</p>
        </div>
      )
    }
  }
}

export default Scanner;