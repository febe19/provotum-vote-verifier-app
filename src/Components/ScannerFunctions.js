import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import {
  getBallotHash,
  getCommitmentScanned,
  getChallengeScanned,
  getShowScanner,
  getScannedChallengesNumbers,
  getResult,
  getTotalNrOfChallenges,
  getVoterPublicKeyH,
  getUniqueID,
  getPublicKey
} from '../Redux/Selector.js';

const ScannerFunctions = () => {
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

  useEffect(() => {
    if (result !== null) {
      console.log(result)
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

      } else if (commitmentScanned && !challengeScanned && qrCodeIsChallenge(qrData)) {
        dispatch({ type: "ADD_CHALLENGE_DATA", payload: qrData })
      } else {
        return;
      }
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
        if (('BH' in qrData) && ('VotingQuestions' in qrData)) {
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

  const qrCodeIsChallenge = (qrData) => {
    if ('id' in qrData && qrData.id === "Challenge") {
      if ('Counter' in qrData && 'Total' in qrData && qrData.Counter <= qrData.Total) {
        if (!scannedChallengesNumbers.includes(qrData.Counter)) {
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