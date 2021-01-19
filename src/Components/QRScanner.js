import React, { useState, useEffect } from 'react';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { useSelector, useDispatch } from "react-redux"


function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export function useWindowDimensions() {
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
    const { height, width } = useWindowDimensions();
    console.log("QRScanner Rendered")
    const dispatch = useDispatch()
    
    const handleScan = (err, result) => {
        if (result !== undefined) {
            dispatch({type: "RESULT", payload: result})
            //console.log(result)
        }
    }

    return (
        <>
            <BarcodeScannerComponent
                width={width}
                onUpdate={handleScan}
            />
        </>
    )
}

export default QRScanner;