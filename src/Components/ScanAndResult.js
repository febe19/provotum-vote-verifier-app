import React, { Component } from 'react'
import Scanner from './Scanner.js'

class ScanAndResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showScanner: true,
        }
    }

    onClick1() {
        console.log("Clicked Camera Button1")
        if (this.state.showScanner) {

            this.setState((state) => ({
                showScanner: !state.showScanner
            }));
        } else {
            this.setState((state) => ({
                showScanner: !state.showScanner
            }));
        }
    }

    render() {
        return (
            <div>
                <div>
                    <button onClick={() => this.onClick1()}>Hide/show Scanner1</button>
                    <div style={this.state.showScanner ? {} : { display: 'none' }}>
                        <Scanner />
                    </div>
                    <p>Result: </p>
                </div>
            </div>
        )
    }
}

export default ScanAndResult;