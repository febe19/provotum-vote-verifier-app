// https://github.com/kybarg/react-qr-scanner#readme

import React, { Component } from 'react'
import QRCodeScanner from './../HelperFunctions/QRScanner.js'
import { Link } from "react-router-dom";

class Scanner extends Component {
  constructor(props) {
    super(props)
    console.log(props.showScanner)
    this.state = {
      commitmentScanned: false,
      commitment: null,
      challenged: false,
      challengeScanned: false,
      challenge: null,
      showScanner: true,
      vote: false
    }
  }

  handleScan = data => {
    if (data.id === "Commitment" && !this.state.commitmentScanned) {
      console.log("Scanned Commitment")
      this.setState({
        commitmentScanned: true,
        commitment: data.data,
        showScanner: false
      })
    }
    else if (data.id === "Challenge" && !this.state.challengeScanned && this.state.commitmentScanned) {
      console.log("Scanned Challenge")
      this.setState({
        challengeScanned: true,
        challenge: data.data,
        showScanner: false
      })
    }
    else if (data.id === "Challenge" && !this.state.challengeScanned && !this.state.commitmentScanned) {
      this.setState({
        showScanner: false
      })
    }
  }

  handleError = err => {
    console.error(err)
  }

  onChallenge = () => {
    this.setState({
      challenged: true,
      showScanner: true
    })
  }

  render() {
    return (
      <div>
        {!this.state.showScanner &&
          <div>
            {this.state.commitmentScanned && !this.state.challengeScanned &&
              <div>
                <p>You scanned the commitment. Continue with 'vote' or 'challenge'</p>
                <Link to={{ pathname: '/result', scannerState: this.state, vote: true }} >
                  <button disabled={this.state.showScanner} >Vote</button>
                </Link>
                <button disabled={this.state.showScanner} onClick={this.onChallenge}>Challenge</button>
              </div>}

            {this.state.commitmentScanned && this.state.challengeScanned &&
              <div>
                <p>You scanned the challenge. Continue with 'view challenge'</p>
                <Link to={{ pathname: '/result', scannerState: this.state, vote: false }} >
                  <button disabled={this.state.showScanner} >View Challenge</button>
                </Link>
              </div>}

            {!this.state.commitmentScanned && !this.state.challengeScanned &&
              <div>
                <p>You must scan the commitment first</p>
                <button disabled={this.state.showScanner} onClick={() => this.setState({ showScanner: true })}>Ok</button>
              </div>}
          </div>}

        {this.state.showScanner &&
          <div>
            {this.state.commitment === null && this.state.challenge === null && <p>Scan the commitment</p>}
            {this.state.challenge === null && this.state.commitment != null && <p>Scan the challenge</p>}
            <QRCodeScanner onScan={this.handleScan} />
          </div>}

        <button onClick={() => console.log(this.state)}>show State</button>
      </div >
    )
  }
}

export default Scanner;