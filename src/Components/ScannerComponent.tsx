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
            <div>
                <ScannerFunctions />
            </div>
            <div style={{ margin: '30px' }}>
                {showScanner &&
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <QRScanner />
                    </div>
                }
            </div>
        </div>
    )
}

export default ScannerComponent;