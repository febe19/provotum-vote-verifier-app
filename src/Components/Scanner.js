import React, { Component } from 'react'
import QrReader from 'react-qr-scanner'

class Scanner extends Component {
  state = {
    result: null,
    
  }

  handleScan = data => {
    if (data) {
      console.log("Scanned Data: " + data)
      this.setState({
        result: data,
      })
    }
  }

  handleError = err => {
    console.error(err)
  }


  render() {
    return (
      <div>
        <QrReader
          delay={100}
          onError={this.handleError}
          onScan={this.handleScan}
          onLoad={this.onLoad}
          style={{ width: '100%' }}
          facingMode={this.user}
          showViewFinder={false}
        />
        <p>{this.state.result}</p>
      </div>
    )
  }
}

export default Scanner;