import React from 'react';
import QRScanner from './QRScanner.js'
import ScannerFunctions from './ScannerFunctions.js'
import { useSelector } from "react-redux"
import {
    getShowScanner
} from '../Redux/Selector.js';

const ScannerComponent = () => {
    console.log("Scanner Component Rendered")
    const showScanner = useSelector(getShowScanner)

    return (
        <div>
            <div style={{ margin: '10px', width: (window.innerWidth - '20px') }}>
                {showScanner &&
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', hidden: !showScanner }}>
                        <QRScanner></QRScanner>
                    </div>
                }
            </div>
            <ScannerFunctions></ScannerFunctions>
        </div>
    )
}

export default ScannerComponent;