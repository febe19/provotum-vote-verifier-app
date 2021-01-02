// https://github.com/kybarg/react-qr-scanner#readme

import React, { Component } from 'react'
import QrReader from 'react-qr-reader'

class QRCodeScanner extends Component {
    
    handleScan = data => {
        const qrdataObj = JSON.parse(data)
        if (data) {
            console.log("Scanned Data in child: ", qrdataObj)
            this.props.onScan(qrdataObj)
        }
    }

    handleError = err => {
        console.error(err)
    }

    render() {
        return (
            <QrReader
                delay={100}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '100%' }}
                facingMode={'environment'}
                showViewFinder={false}
            />
        )
    }

}

export default QRCodeScanner;

