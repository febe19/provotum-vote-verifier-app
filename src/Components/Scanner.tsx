import React, { useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import Button from '@material-ui/core/Button';
import QRScanner from './QRScanner'
import { Hashicon } from '@emeraldpay/hashicon-react';
import { makeStyles, Theme } from '@material-ui/core/styles';
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
} from '../Redux/Selector';
import {
  RAT,
  AppStatus,
} from '../Redux/Reducer'

const Scanner = () => {
  console.log("== Scanner Component ============");

  const qrScannerRef: any = useRef(null);
  var qrData = {}

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
          dispatch({ type: RAT.HIDE_SCANNER })
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

  return (
    <div>
      <div className="ScannerFlexBox" style={{ height: usableHeight, maxHeight: usableHeight }}>

        {commitmentScanned && !challengeScanned &&
          <div className="Item">
            <div>
              <h1 className="centerHorizontally">Commitment scan successful</h1>
              <h3> Received Ballot Hash: </h3>
              <p>{receivedBallotHash}</p>
              <div className="centerHorizontally">
                <div className="hashIconDiv">
                  <Hashicon value={receivedBallotHash} size={usableHeight / 10} />
                </div>
              </div>
            </div>
          </div>
        }

        {showScanner && !commitmentScanned &&
          <div className="Item">
            <div className="centerHorizontally">
              <h1 style={{ marginBottom: "1%" }}>Scan Commitment</h1>
            </div>
          </div>
        }

        {commitmentScanned && challengeScanned &&
          <div>
            <div className="Item">
              <div>
                <h1 className="centerHorizontally">Challenge scan successful</h1>
                <h3> Received Ballot Hash: </h3>
                <p>{receivedBallotHash}</p>
                <div className="centerHorizontally">
                  <div className="hashIconDiv">
                    <Hashicon value={receivedBallotHash} size={usableHeight / 10} />
                  </div>
                </div>
              </div>
            </div>

            <div className="buttonDivPosition">
              <div className="centerHorizontally">
                <p>You scanned the challenge. Continue with 'Next'</p>
              </div>

              <div className="buttonDiv">
                <div className="buttonStyle">
                  <Link to='/result' style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary" fullWidth={true}>Next</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        }

        {((showScanner && commitmentScanned) || (commitmentScanned && challengeScanned)) &&
          <div className="Item">
            <div className="progressFlexbox">
              <h3 className="titel" style={{ margin: 'auto 10% auto 1%' }}>Scanning-Progress</h3>
              {totalNrOfChallenges > 0 && scannedChallengesNumbers.map((qrCodes: any) =>
                <div className="item">
                  {qrCodes &&
                    <div>
                      <div style={{ margin: 'auto 10%' }}>
                        <svg className="resultSVG" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                          <circle className="pathCircle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                          <polyline className="pathCheck" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
                        </svg>
                      </div>
                    </div>
                  }
                  {!qrCodes &&
                    <div>
                      <div style={{ margin: 'auto 10%' }}>
                        <svg className="resultSVG" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                          <circle className="pathCircle" fill="none" stroke="#ba0000" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                          <line className="pathLine" fill="none" stroke="#ba0000" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
                          <line className="pathLine" fill="none" stroke="#ba0000" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
                        </svg>
                      </div>
                    </div>
                  }
                </div>
              )}
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

      {commitmentScanned && !showScanner && !challengeScanned &&
        <div className="buttonDivPosition">
          <div className="centerHorizontally">
            <p>You scanned the commitment, continue with 'cast' or 'challenge'</p>
          </div>
          <div className="buttonDiv">
            <div className="buttonStyle">
              <Link onClick={onCast} to='/result' style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" fullWidth={true}>Cast</Button>
              </Link>
            </div>
            <div className="buttonStyle">
              <Button onClick={onChallenge} variant="contained" color="primary" fullWidth={true}>Challenge</Button>
            </div>
          </div>
        </div>
      }


    </div>
  )
}

export default Scanner;