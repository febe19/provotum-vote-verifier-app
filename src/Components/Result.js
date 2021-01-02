import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Result extends Component {
  constructor(props) {
    super(props)
    this.state = {
        qrdata : props.location.qrdata,
        id: props.location.qrdata.id,
        data: props.location.qrdata.data
    }
  }
  
  render() {
    return (
      <div>
        <h1>Vote Verification</h1>
        <p>QRCode ID: {this.state.id}</p>
        <p>Data: {this.state.data}</p>


        <Link to="/">
            <button>Back to Start</button>
        </Link>
      </div>
    )

  }
}

export default Result;