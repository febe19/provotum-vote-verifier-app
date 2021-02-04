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

// Component consisting of the QR code scanner and the white frame to illustrate the focus.
// Results are stored in the redux store directly after scanning and then parsed in the scanner component. 
// The maximal scanner size is also conducted form the Redux store. This is needed, that the scanner is maximized but never too big

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