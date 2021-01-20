import React, { useState, useEffect } from 'react';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { useSelector, useDispatch } from "react-redux"
import { useWindowDimensions } from '../index.js'


const QRScanner = () => {
    const { height, width } = useWindowDimensions();
    console.log("QRScanner Rendered")
    const dispatch = useDispatch()

    const handleScan = (err, result) => {
        if (result !== undefined) {
            dispatch({ type: "SCANNER_RESULT", payload: result.text })
            //console.log(result)
        }
    }

    return (
        <>
            <BarcodeScannerComponent
                audio={false}
                width={width}
                onUpdate={handleScan}
            />
        </>
    )
}

export default QRScanner;