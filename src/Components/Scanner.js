import React, { useState } from 'react';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { Link } from "react-router-dom";

const Scanner = () => {

  const [data, setData] = useState('');
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

  const qrCodeIsChallenge = (qrData) => {
    if ('id' in qrData && qrData.id === "Challenge") {
      if ('Counter' in qrData && 'Total' in qrData && qrData.Counter <= qrData.Total) {
        
        if (typeof challenge[qrData.Counter] === 'undefined') {
          challenge[qrData.Counter] = qrData
          setData(JSON.stringify(challenge))
          console.log("Added Challenge with Counter: "+ qrData.Counter)
        } else {
          console.log("Already Scanned Challenge with Counter: "+qrData.Counter)
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
    if (result) {
      try {
        qrData = JSON.parse(result.text)
      } catch {
        console.log("Could not parse JSON --> Result", result.text);
        setData("Scanned QR code is not of expected format");
        return;
      }

      if (!commitmentScanned && qrCodeIsCommitment(qrData)) {
        setCommitmentScanned(true);
        setShowScanner(false);

      } else if (!challengeScanned && qrCodeIsChallenge(qrData)) {
        setChallengeScanned(true)
        setShowScanner(false)
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
          {!commitmentScanned && <div>
            Please scan the commitment
          </div>}
          {!challengeScanned && commitmentScanned && <div>
            Please scan the Challenge
          </div>}
          <BarcodeScannerComponent
            width={500}
            height={500}
            onUpdate={handleScan}
          />
        </div>
      }
      <p>Ballot Hash: {ballotHash}</p>
      <p>Data: {data}</p>

      {commitmentScanned && !showScanner && <div>
        <p>You scanned the commitment. Continue with 'vote' or 'challenge'</p>
        <Link to={{ pathname: '/result' }} >
          <button>Vote</button>
        </Link>
        <button onClick={onChallenge}>Challenge</button>
      </div>}

      {commitmentScanned && challengeScanned &&
        <div>
          <p>You scanned the challenge. Continue with 'view challenge'</p>
          <Link to={{ pathname: '/result' }} >
            <button>View Challenge</button>
          </Link>
        </div>}


    </>
  )
}

export default Scanner;