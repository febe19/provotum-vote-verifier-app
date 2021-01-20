import React from 'react';
import QRScanner from './QRScanner'
import ScannerFunctions from './ScannerFunctions'
import { useSelector } from "react-redux"
import {
    getShowScanner
} from '../Redux/Selector';

const ScannerComponent = () => {
    console.log("Scanner Component Rendered")
    const showScanner = useSelector(getShowScanner)

    return (
        <div>
            <div style={{ margin: '10px', width: (window.innerWidth) }}>
                {showScanner &&
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <QRScanner />
                    </div>
                }
            </div>
            <ScannerFunctions />
        </div>
    )
}

export default ScannerComponent;