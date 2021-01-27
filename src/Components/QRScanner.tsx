import BarcodeScannerComponent from "react-webcam-barcode-scanner"; //https://www.npmjs.com/package/react-webcam-barcode-scanner TODO: Eventually delete
import { useDispatch } from "react-redux"
import './OverallCSS.css'
import React from 'react';
import QrReader from "react-qr-reader"; // https://www.npmjs.com/package/@types/react-qr-reader
import { ReactComponent as CameraFocusWhite } from './../CameraFocus.svg';
import {
    RAT
} from '../Redux/Reducer'

import { useState, useEffect } from 'react';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

const QRScanner = () => {
    console.log("QRScanner Rendered")
    const { height, width } = useWindowDimensions();
    var sizeUsed = width * 0.9 > height * 0.9 ? height * 0.9 : width * 0.9
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

        <div className="qrScannerContainer" style={{ maxHeight: (sizeUsed - 40), maxWidth: (sizeUsed - 20) }}>
            <div className="loaderPosition">
                <div className="lds-dual-ring" />
                <div className="loaderText">loading camera...</div>
            </div>
            <div className="svgClass" >
                <svg viewBox={"0 0 630 630"}>
                    <CameraFocusWhite />
                </svg>
            </div>
            <QrReader
                delay={200}
                showViewFinder={false}
                facingMode={"environment"}
                onError={handleError}
                onScan={handleScan}
                style={{ widht: '100%', height: '100%' }}
            />
        </div>

    )
}

export default QRScanner;