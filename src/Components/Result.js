import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Result extends Component {
  constructor(props) {
    super(props)
    console.log(this.props.location.state)

    this.state = {
        data : this.props.location.state,
    }
  }

  

  render() {
    return (
      <div>
        <p>You voted for: {this.state.data}</p>

        <Link to="/">
            <button>Back to Start</button>
        </Link>
      </div>
    )

  }
}

export default Result;