import React, { Component } from 'react'


class NotFound extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h1>404</h1>
                <p>This site was unfortunately not found</p>
            </div>
        )
    }
}

export default NotFound;