import React, { useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import Button from '@material-ui/core/Button';
import QRScanner from './QRScanner'
import { Hashicon } from '@emeraldpay/hashicon-react';
import {
  getReceivedBallotHash,
  getCommitmentScanned,
  getChallengeScanned,
  getShowScanner,
  getScannedChallengesNumbers,
  getResult,
  getTotalNrOfChallenges,
  getHeight,
  getHelpOpen,
  getVotingQuestions,
} from '../Redux/Selector';
import {
  RAT,
  AppStatus,
} from '../Redux/Reducer'

const getVotingQuestionText = (votingQuestions: Array<any>) => {
  var questionArray: Array<any> = [];

  Object.entries(votingQuestions).forEach(([key, value]) => {
    if (value.answerBin === undefined) {
      return
    }
    questionArray.push([value.Question, value.answerBin])
  })

  return (
    <div>
      {questionArray.map((Questions: any) =>
        <div>
          <div className="questionFlexbox">
            <div className="question">
              {Questions[0].toString()}
            </div>
            <div className="answer">
              <h3 style={{ margin: 'auto 1% auto 5%' }}>{Questions[1] === 1 ? 'YES' : 'NO'}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Scanner = () => {
  console.log("== Scanner Component ============");

  const qrScannerRef: any = useRef(null);
  const progressRef: any = useRef(null);
  var qrData = {}
  var questionArray: Array<any> = [];

  //REDUX definitions
  const dispatch = useDispatch()
  const receivedBallotHash = useSelector(getReceivedBallotHash);
  const commitmentScanned = useSelector(getCommitmentScanned)
  const challengeScanned = useSelector(getChallengeScanned)
  const showScanner = useSelector(getShowScanner)
  const result = useSelector(getResult)
  const scannedChallengesNumbers = useSelector(getScannedChallengesNumbers)
  const totalNrOfChallenges = useSelector(getTotalNrOfChallenges)
  const usableHeight = useSelector(getHeight)
  const helpOpen = useSelector(getHelpOpen)
  const votingQuestions: Array<any> = useSelector(getVotingQuestions);

  useEffect(() => {
    dispatch({ type: RAT.STATUS, payload: AppStatus.SCAN_COMMITMENT })
  }, [])


  useEffect(() => {
    const scannerResizeHandler = () => {
      if (showScanner) {
        var scannerSizeArray: Array<Number> = []
        scannerSizeArray[0] = qrScannerRef.current!.clientHeight
        scannerSizeArray[1] = qrScannerRef.current!.clientWidth
        dispatch({
          type: RAT.MAXSCANNERSIZE,
          payload: scannerSizeArray
        })
      }
    }
    scannerResizeHandler()
    window.addEventListener('resize', scannerResizeHandler);

    return () => {
      window.removeEventListener('resize', scannerResizeHandler);
    }
  }, [usableHeight, showScanner])

  useEffect(() => {
    // Try to parse the result to JSON format
    if (result !== null && !helpOpen) {
      qrData = {};
      try {
        qrData = JSON.parse(result)
        if ('id' in qrData && ('Commitment' in qrData || 'Challenge' in qrData)) {
          console.log("Looks like a valid QRCode")
        }

      } catch {
        console.log("Could not parse JSON --> Result", result.text);
        return;
      }

      // Add qrData to commitment or challenge in Redux store. Before this check if it is needed anymore.
      if (!commitmentScanned && qrCodeIsCommitment(qrData)) {
        dispatch({ type: RAT.HIDE_SCANNER })
        dispatch({ type: RAT.COMMITMENT_SCANNED })
        dispatch({ type: RAT.STATUS, payload: AppStatus.CHALLENGE_OR_CAST })
        dispatch({ type: RAT.ADD_COMMITMENT_DATA, payload: qrData })

      } else if (commitmentScanned && !challengeScanned && qrCodeIsChallenge(qrData)) {
        dispatch({ type: RAT.ADD_CHALLENGE_DATA, payload: qrData })

        // Iff all challenges are scanned, hide the scanner 
        if (scannedChallengesNumbers !== 'undefined' && scannedChallengesNumbers.length > 0 && scannedChallengesNumbers.every((v: any) => v === true)) {
          dispatch({ type: RAT.CHALLENGE_SCANNED })

          setTimeout(() => {
            dispatch({ type: RAT.HIDE_SCANNER })
            dispatch({ type: RAT.STATUS, payload: AppStatus.CONFIRM_SELECTION })
          }, 1000);

          Object.entries(votingQuestions).forEach(([key, value]) => {
            console.log("Key: ", key, "--> Value: ", value)
            if (value.answerBin === undefined) {
              return
            }
            questionArray.push([value.Question, value.answerBin])
          })
        }
      } else {
        return;
      }
    }
  }, [result, helpOpen]);

  // Check if qr data is Commitment and if it fits expected form
  const qrCodeIsCommitment = (qrData: any) => {
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

  // Check if qr data is Challenge and if it fits expected form
  const qrCodeIsChallenge = (qrData: any) => {
    if ('id' in qrData && qrData.id === "Challenge") {
      if ('Counter' in qrData && 'Total' in qrData && qrData.Counter <= qrData.Total) {
        if (!scannedChallengesNumbers.includes(qrData.Counter)) {
          return true;
        } else {
          console.log("CHALLENGE: Already scanned challenge with ID: ", qrData.Counter);
          return false
        }
      } else {
        console.log("CHALLENGE: Problem with Counter");
        return false
      }
    } else {
      console.log("CHALLENGE: Problem With ID");
      return false
    }
  }

  // When User selects Challenge, show scanner
  const onChallenge = () => {
    dispatch({ type: RAT.SHOW_SCANNER })
    dispatch({ type: RAT.STATUS, payload: AppStatus.SCAN_CHALLENGE })
    dispatch({ type: RAT.CHALLENGE_OR_CAST, payload: "CHALLENGE" })
  }

  // When User selects Cast, hide scanner, Link to result in HTML
  const onCast = () => {
    dispatch({ type: RAT.HIDE_SCANNER })
    dispatch({ type: RAT.STATUS, payload: AppStatus.RESULT })
    dispatch({ type: RAT.CHALLENGE_OR_CAST, payload: "CAST" })
  }

  const onConfirmSelection = () => {
    dispatch({ type: RAT.SELECTION_CONFIRMED, payload: true })
  }

  // When User selects Cast, hide scanner, Link to result in HTML
  const onNOTConfirmSelection = () => {
    dispatch({ type: RAT.SELECTION_CONFIRMED, payload: false })
  }

  return (
    <div>
      <div className="ScannerFlexBox" style={{ height: usableHeight, maxHeight: usableHeight }}>

        {showScanner && !commitmentScanned &&
          <div className="Item">
            <div className="centerHorizontally">
              <h1 style={{ marginBottom: "1%" }}>Scan Commitment</h1>
            </div>
          </div>
        }

        {commitmentScanned &&
          <div className="Item">
            <div>
              <h1 className="centerHorizontally">Commitment scan successful</h1>
              <h3> Received Ballot Hash </h3>
              <p>{receivedBallotHash}</p>
              <div className="centerHorizontally">
                <div className="hashIconDiv">
                  <Hashicon value={receivedBallotHash} size={(usableHeight / 10) < 70 ? 70 : (usableHeight / 10)} />
                </div>
              </div>
            </div>
          </div>
        }

        {((showScanner && commitmentScanned) || (commitmentScanned && challengeScanned && showScanner)) &&
          <div className="Item" ref={progressRef}>
            <div className="progressFlexbox">
              <div style={{ height: usableHeight * 0.05, marginLeft: '1%', marginRight: '5%' }} className="titel" >
                <h3 style={{ marginTop: '0' }}>Scanning-Progress</h3>
              </div>
              {totalNrOfChallenges > 0 && scannedChallengesNumbers.map((qrCodes: any) =>
                <div className='item'>
                  {qrCodes &&
                    <div style={{ margin: 'auto' }}>
                      <svg className="resultSVG" style={{ height: usableHeight * 0.05, maxWidth: ((progressRef.current.clientWidth - 170 - (progressRef.current.clientWidth * 0.05)) / scannedChallengesNumbers.length) }} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                        <circle className="pathCircle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                        <polyline className="pathCheck" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
                      </svg>
                    </div>
                  }
                  {!qrCodes &&
                    <div style={{ margin: 'auto' }}>
                      <svg className="resultSVG" style={{ height: usableHeight * 0.05, maxWidth: ((progressRef.current.clientWidth - 170 - (progressRef.current.clientWidth * 0.05)) / scannedChallengesNumbers.length) }} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                        <circle className="pathCircle" fill="none" stroke="#ba0000" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                        <line className="pathLine" fill="none" stroke="#ba0000" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
                        <line className="pathLine" fill="none" stroke="#ba0000" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
                      </svg>
                    </div>
                  }
                </div>
              )}
            </div>
          </div>
        }

        {commitmentScanned && challengeScanned && !showScanner &&
          <div className="Item">
            <h3>Voting Questions</h3>
            <div className="centerHorizontally">
              {getVotingQuestionText(votingQuestions)}
            </div>
          </div>
        }

        {showScanner &&
          <div className="Scanner" ref={qrScannerRef}>
            <div className="centerHorizontally" style={{ height: '100%', alignItems: "flex-start" }}>
              <QRScanner />
            </div>
          </div>
        }
      </div>

      {!showScanner && commitmentScanned && !challengeScanned &&
        <div className="buttonDivPosition">
          <div className="centerHorizontally">
            <p style={{ margin: '0.5% 3%' }}>You scanned the commitment, continue with 'cast' or 'challenge'</p>
          </div>
          <div className="buttonDiv">
            <div className="buttonStyle">
              <Link onClick={onCast} to='/result' style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" fullWidth={true} disabled={helpOpen}>Cast</Button>
              </Link>
            </div>
            <div className="buttonStyle">
              <Button onClick={onChallenge} variant="contained" color="primary" fullWidth={true} disabled={helpOpen}>Challenge</Button>
            </div>
          </div>
        </div>
      }

      {!showScanner && commitmentScanned && challengeScanned &&
        <div className="buttonDivPosition">
          <div className="centerHorizontally">
            <p>Did you vote for the displayed options above?</p>
          </div>

          <div className="buttonDiv">
            <div className="buttonStyle">
              <Link onClick={onNOTConfirmSelection} to='/result' style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" fullWidth={true} disabled={helpOpen}>No</Button>
              </Link>
            </div>
            <div className="buttonStyle">
              <Link onClick={onConfirmSelection} to='/result' style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" fullWidth={true} disabled={helpOpen}>Yes</Button>
              </Link>
            </div>
          </div>
        </div>
      }

    </div>
  )
}

export default Scanner;