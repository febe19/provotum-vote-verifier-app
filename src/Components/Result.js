import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Result extends Component {
  constructor(props) {
    super(props)
    console.log("Received State: ", props.location.scannerState)
    if (props.location.scannerState != null && props.location.vote != null) {
      this.state = {
        commitment: props.location.scannerState.commitment,
        challenge: props.location.scannerState.challenge,
        vote: props.location.vote
      }
    } else {
      this.state = {
        commitment: null,
        challenge: null,
        vote: false
      }
    }
  }

  render() {
    return (
      <div>

        <div hidden={!this.state.vote}>
          <h1>Thanks fot Voting</h1>
          <p>Your vote was cast in the system. You can close this site now.</p>
        </div>

        <div hidden={this.state.vote}>
          <h1>Vote Verification</h1>
          <p>Commitment: {this.state.commitment}</p>
          <p>Challenge: {this.state.challenge}</p>


          <Link to="/">
            <button>Back to Start</button>
          </Link>
        </div>
      </div>

    )

  }
}

export default Result;