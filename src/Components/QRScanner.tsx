import React, { useState, useEffect } from 'react';
import BarcodeScannerComponent from "react-webcam-barcode-scanner"; //https://www.npmjs.com/package/react-webcam-barcode-scanner TODO: Eventually delete
import { useSelector, useDispatch } from "react-redux"
import QrReader from "react-qr-reader"; // https://www.npmjs.com/package/@types/react-qr-reader
import {
    RAT
} from '../Redux/Reducer'

const QRScanner = () => {
    console.log("QRScanner Rendered")
    const dispatch = useDispatch()

    const handleScan = (result: any) => {
        if (result !== null) {
            dispatch({ type: RAT.SCANNER_RESULT, payload: result })
        }
    }

    const handleError = (err: any) => {
        console.log(err)
    }

    return (
        <>
            <QrReader
                delay={300}
                facingMode={"environment"}
                showViewFinder={true}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '90%', height: '90%' }}
            />
        </>
    )
}

export default QRScanner;