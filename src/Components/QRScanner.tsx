import React, { useState, useEffect } from 'react';
import BarcodeScannerComponent from "react-webcam-barcode-scanner"; //https://www.npmjs.com/package/react-webcam-barcode-scanner TODO: Eventually delete
import { useSelector, useDispatch } from "react-redux"
import QrReader from "react-qr-reader"; // https://www.npmjs.com/package/@types/react-qr-reader

const QRScanner = () => {
    console.log("QRScanner Rendered")
    const dispatch = useDispatch()

    const handleScan = (err: any, result: any) => {
        if (result !== undefined) {
            dispatch({ type: "SCANNER_RESULT", payload: result.text })
        }
    }

    const handleScan2 = (result: any) => {
        console.log(result)
        if (result !== null) {
            console.log("Dispatch")
            dispatch({ type: "SCANNER_RESULT", payload: result })
        }
    }

    const handleError = (err: any) => {

    }

    return (
        <>
            <QrReader
                delay={300}
                facingMode={"environment"}
                showViewFinder={true}
                onError={handleError}
                onScan={handleScan2}
                style={{ width: '90%', height: '90%' }}
            />
        </>
    )
}

export default QRScanner;