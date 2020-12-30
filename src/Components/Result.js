import React, { Component } from 'react'

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
      </div>
    )

  }
}

export default Result;