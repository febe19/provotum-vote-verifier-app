import BarcodeScannerComponent from "react-webcam-barcode-scanner"; //https://www.npmjs.com/package/react-webcam-barcode-scanner TODO: Eventually delete
import { useSelector, useDispatch } from "react-redux"
import './OverallCSS.css'
import React from 'react';
import QrReader from "react-qr-reader"; // https://www.npmjs.com/package/@types/react-qr-reader
import { ReactComponent as CameraFocusWhite } from './../CameraFocus.svg';
import {
    RAT
} from '../Redux/Reducer'
import {
    getMaxScannerHeight,
    getMaxScannerWidth,
} from '../Redux/Selector';

const QRScanner = () => {
    const dispatch = useDispatch()
    const maxScannerHeight = useSelector(getMaxScannerHeight);
    const maxScannerWidth = useSelector(getMaxScannerWidth); 

    const handleScan = (result: any) => {
        if (result !== null) {
            dispatch({ type: RAT.SCANNER_RESULT, payload: result })
        }
    }

    const handleError = (err: any) => {
        console.log(err)
    }

    return (

        <div className="qrScannerContainer"
            style={{
                height: maxScannerWidth,
                width: maxScannerWidth,
                maxHeight: maxScannerHeight,
                maxWidth: maxScannerHeight
            }}>
            <div className="loaderPosition">
                <div className="lds-dual-ring" />
                <div className="loaderText">loading camera...</div>
            </div>
            <div className="svgClass" >
                <CameraFocusWhite />
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