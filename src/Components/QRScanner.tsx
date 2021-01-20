import React, { useState, useEffect } from 'react';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { useSelector, useDispatch } from "react-redux"
import { useWindowDimensions } from '../index'


const QRScanner = () => {
    const { height, width } = useWindowDimensions();
    console.log("QRScanner Rendered")
    const dispatch = useDispatch()

    const handleScan = (err: any, result: any) => {
        if (result !== undefined) {
            dispatch({ type: "SCANNER_RESULT", payload: result.text })
        }
    }

    return (
        <>
            <BarcodeScannerComponent
                height={width}
                width={width}
                onUpdate={handleScan}
            />
        </>
    )
}

export default QRScanner;