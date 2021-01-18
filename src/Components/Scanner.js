import React, { useState, useEffect } from 'react';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import {
  getBallotHash, getCommitmentScanned, getChallengeScanned, getShowScanner
} from '../Redux/Selector.js';

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

  //REDUX stuff
  const dispatch = useDispatch()
  const ballotHash = useSelector(getBallotHash);
  const commitmentScanned = useSelector(getCommitmentScanned)
  const challengeScanned = useSelector(getChallengeScanned)
  const showScanner = useSelector(getShowScanner)


  console.log("Scanner initiated with width: ", width)

  var qrData = {}
  var cnt = 0;

  const qrCodeIsCommitment = (qrData) => {
    if ('id' in qrData && qrData.id === "Commitment") {
      if ('Counter' in qrData && 'Total' in qrData && qrData.Counter <= qrData.Total) {
        if (('BH' in qrData) && ('publicKey' in qrData) && ('voterPublicKeyH' in qrData) && ('uniqueID' in qrData)) {
          return true
        } else {
          console.log("COMMITMENT: Missing Data")
          return false
        }
      } else {
        console.log("COMMITNEMT: Problem with Counter")
        return false
      }
    } else {
      console.log("COMMITNEMT: Problem With ID")
      return false
    }
  }

  const qrCodeIsChallenge = (qrData, cnt) => {
    console.log("cnt: ", cnt)

    if ('id' in qrData && qrData.id === "Challenge") {
      if ('Counter' in qrData && 'Total' in qrData && qrData.Counter <= qrData.Total) {
        //TODO: Add the Commitments to a state
        console.log("Added Commitment", qrData.Counter)
        return true;
      } else {
        console.log("CHALLENGE: Problem with Counter")
        return false
      }
    } else {
      console.log("CHALLENGE: Problem With ID")
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
        return;
      }

      if (!commitmentScanned && qrCodeIsCommitment(qrData)) {
        dispatch({ type: "HIDE_SCANNER" })
        dispatch({ type: "COMMITMENT_SCANNED" })
        dispatch({ type: "ADD_COMMITMENT_DATA", payload: qrData })
        console.log("Commitment Scanned")

      } else if (commitmentScanned && !challengeScanned && qrCodeIsChallenge(qrData, cnt)) {
        //If check if all commitments are scanned
        dispatch({ type: "CHALLENGE_SCANNED" })
        dispatch({ type: "HIDE_SCANNER" })
      } else {
        return;
      }

      console.log("Parsed JSON: ", qrData)
    }
  }

  const onChallenge = () => {
    dispatch({ type: "SHOW_SCANNER" })
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

      {commitmentScanned && !showScanner && !challengeScanned &&<div style={{ margin: '10px' }}>
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