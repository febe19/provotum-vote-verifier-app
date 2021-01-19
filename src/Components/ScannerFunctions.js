import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import {
  getBallotHash, getCommitmentScanned, getChallengeScanned, getShowScanner, getScannedChallengesNumbers, getResult, getTotalNrOfChallenges
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


const ScannerFunctions = () => {
  const { height, width } = useWindowDimensions();
  console.log("ScannerFunctions Rendered")

  //REDUX stuff
  const dispatch = useDispatch()
  const ballotHash = useSelector(getBallotHash);
  const commitmentScanned = useSelector(getCommitmentScanned)
  const challengeScanned = useSelector(getChallengeScanned)
  const showScanner = useSelector(getShowScanner)
  const result = useSelector(getResult)
  const scannedChallengesNumbers = useSelector(getScannedChallengesNumbers)
  const totalNrOfChallenges = useSelector(getTotalNrOfChallenges)

  var qrData = {}
  var cnt = 0;

  useEffect(() => {
    if (result !== null) {
      try {
        qrData = JSON.parse(result.text)
      } catch {
        console.log("Could not parse JSON --> Result", result.text);
        return;
      }

      // Add qrData to commitment or challenge 
      if (!commitmentScanned && qrCodeIsCommitment(qrData)) {
        dispatch({ type: "HIDE_SCANNER" })
        dispatch({ type: "COMMITMENT_SCANNED" })
        dispatch({ type: "ADD_COMMITMENT_DATA", payload: qrData })
        console.log("Commitment Scanned")

      } else if (commitmentScanned && !challengeScanned && qrCodeIsChallenge(qrData, cnt)) {
        //If check if all commitments are scanned
        dispatch({ type: "ADD_CHALLENGE_DATA", payload: qrData })
      
      } else {
        return;
      }

      //console.log("Parsed JSON: ", qrData)
    }
  }, [result]);

  useEffect(() => {

    if (totalNrOfChallenges != 0 && scannedChallengesNumbers.length == totalNrOfChallenges) {
      dispatch({ type: "CHALLENGE_SCANNED" })
      dispatch({ type: "HIDE_SCANNER" })
    }

  }, [scannedChallengesNumbers])

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
        if (!scannedChallengesNumbers.includes(qrData.Counter)) {
          //TODO: Add the Commitments to a state
          return true;
        } else {
          console.log("CHALLENGE: Already scanned challenge with ID: ", qrData.Counter)
          return false
        }
      } else {
        console.log("CHALLENGE: Problem with Counter")
        return false
      }
    } else {
      console.log("CHALLENGE: Problem With ID")
      return false
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

            </div>
          </div>
        </div>
      }
      <p style={{ margin: '10px' }}>Ballot Hash: {ballotHash}</p>

      {commitmentScanned && !showScanner && !challengeScanned && <div style={{ margin: '10px' }}>
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

export default ScannerFunctions;