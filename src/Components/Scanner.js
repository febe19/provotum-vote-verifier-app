import React, { useState, useEffect } from 'react';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { Link } from "react-router-dom";

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


const Scanner = () => {
  const { height, width } = useWindowDimensions();
  console.log(width)

  const [data, setData] = useState({});
  const [error, setError] = useState();
  const [ballotHash, setBallotHash] = useState('');
  const [commitmentScanned, setCommitmentScanned] = useState(false);
  const [challengeScanned, setChallengeScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(true);
  var scannerHistory = [];
  var qrData = {}
  var publicKey = {}
  var voterPublicKeyH = ''
  var uniqueID = ''
  var challenge = {}
  var cnt = 0;

  const qrCodeIsCommitment = (qrData) => {
    if ('id' in qrData && qrData.id === "Commitment") {
      if ('Counter' in qrData && 'Total' in qrData && qrData.Counter <= qrData.Total) {
        if (!('BH' in qrData) || !('publicKey' in qrData) || !('voterPublicKeyH' in qrData) || !('uniqueID' in qrData)) {
          return false
        } else {
          setBallotHash(qrData.BH)
          publicKey = qrData.publicKey
          voterPublicKeyH = qrData.voterPublicKeyH
          uniqueID = qrData.uniqueID
          console.log("Commitment Scanned")
          return true
        }
      } else {
        return false
      }
    } else {
      return false
    }
  }

  const qrCodeIsChallenge = (qrData, cnt) => {
    console.log("cnt: ", cnt)
    console.log("data: ", data)
    console.log("challenge: ", challenge)

    if ('id' in qrData && qrData.id === "Challenge") {

      if ('Counter' in qrData && 'Total' in qrData && qrData.Counter <= qrData.Total) {
        console.log(data[qrData.Counter])
        console.log("TypeOf: ", typeof data[qrData.Counter])

        if (typeof data[qrData.Counter] === 'undefined') {
          challenge[qrData.Counter] = qrData
          console.log(challenge)
          setData(challenge)
          console.log("Added Challenge with Counter: " + qrData.Counter)
          return true
        } else {
          console.log("Already Scanned Challenge with Counter: " + qrData.Counter)
          return false
        }

      } else {
        return false
      }
    } else {
      return false
    }
  }

  const handleScan = (err, result) => {
    cnt++
    if (result) {
      try {
        qrData = JSON.parse(result.text)
      } catch {
        console.log("Could not parse JSON --> Result", result.text);
        setError("Scanned QR code is not of expected format");
        return;
      }

      if (!commitmentScanned && qrCodeIsCommitment(qrData)) {
        setCommitmentScanned(true);
        setShowScanner(false);

      } else if (!challengeScanned && qrCodeIsChallenge(qrData, cnt)) {
        setChallengeScanned(true)
        setShowScanner(true)
      } else {
        console.log("QR Code is neither Commitment nor Challenge. Or one is already scanned")
        return;
      }

      console.log("Parsed JSON: ", qrData)

      scannerHistory.push(JSON.parse(result.text))
    }
  }

  const onChallenge = () => {
    setShowScanner(true)
  }


  return (
    <>
      {showScanner &&
        <div>
          {!commitmentScanned && <div style={{ margin: '10px' }}>
            Please scan the commitment
          </div>}
          {!challengeScanned && commitmentScanned && <div style={{ margin: '10px' }}>
            Please scan the Challenge
          </div>}
          <div style={{ margin: '10px', width: (window.innerWidth - '20px') }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <BarcodeScannerComponent
                width={width}
                onUpdate={handleScan}
              />
            </div>
          </div>
        </div>
      }
      <p style={{ margin: '10px' }}>Ballot Hash: {ballotHash}</p>
      <p style={{ margin: '10px' }}>Data: {JSON.stringify(data)}</p>

      {commitmentScanned && !showScanner && <div style={{ margin: '10px' }}>
        <p>You scanned the commitment. Continue with 'vote' or 'challenge'</p>
        <Link to={{ pathname: '/result' }} >
          <button>Vote</button>
        </Link>
        <button onClick={onChallenge}>Challenge</button>
      </div>}

      {commitmentScanned && challengeScanned &&
        <div>
          <p style={{ margin: '10px' }}>You scanned the challenge. Continue with 'view challenge'</p>
          <Link to={{ pathname: '/result' }} >
            <button>View Challenge</button>
          </Link>
        </div>}


    </>
  )
}

export default Scanner;