import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { bnToHex } from '@polkadot/util';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import BN from 'bn.js';
import * as crypto from "crypto-js";
import { Hashicon } from '@emeraldpay/hashicon-react';
import {
  RAT,
  AppStatus
} from '../Redux/Reducer'
import {
  getChallengeOrCast,
  getReceivedBallotHash,
  getCalculatedBallotHash,
  getVotingQuestions,
  getPublicKey,
  getVoterPublicKeyH,
  getVerificationResult,
  getHeight,
} from '../Redux/Selector'

import {
  encrypt,
  verifyReEncryptionProof,
  ElGamalPublicKey,
} from '@hoal/evote-crypto-ts'

// Actual Encryption of the data. 
function CreateEncryptedBallot(votingQuestions: Array<any>, publicKey: ElGamalPublicKey, voterPublicKeyH: BN) {
  var allVerified: any = null
  var verifies: Boolean = false

  const encryptedBallots: Array<any> = []

  Object.entries(votingQuestions).forEach(([key, value]) => {
    if (value.answerBin === undefined) {
      return
    }
    const encryptedVote: Array<any> = []

    const encryptedBallot = encrypt(value.answerBin, publicKey, value.nonce);

    var verifies = verifyReEncryptionProof(
      value.reEncryptionProof,
      value.reEncryptedBallot,
      encryptedBallot,
      publicKey,
      voterPublicKeyH,
    );

    // Check if all previos ballots and current verify. if one does not verify return false in the end. 
    allVerified = allVerified !== null ? (verifies && allVerified ? (true) : (false)) : (verifies)

    const cipherToSubstrate = {
      c: bnToHex(value.reEncryptedBallot.c),
      d: bnToHex(value.reEncryptedBallot.d),
    };

    // Push to arrays for hashing 
    encryptedVote.push(key);
    encryptedVote.push(cipherToSubstrate);
    encryptedBallots.push(encryptedVote)
  })

  verifies = allVerified !== null ? (allVerified) : (false)
  return [encryptedBallots, verifies]
}


const Result = () => {
  console.log("== Result ============");

  // REDUX Definitions
  const dispatch = useDispatch()
  const receivedBallotHash = useSelector(getReceivedBallotHash);
  const calculatedBallotHash = useSelector(getCalculatedBallotHash);
  const challengeOrCast = useSelector(getChallengeOrCast);
  const votingQuestions: Array<any> = useSelector(getVotingQuestions);
  const publicKey: ElGamalPublicKey = useSelector(getPublicKey);
  const voterPublicKeyH: BN = useSelector(getVoterPublicKeyH);
  const verificationResult: Boolean = useSelector(getVerificationResult);
  const usableHeight = useSelector(getHeight)
  var encryptionResult: Array<any> = []

  dispatch({ type: RAT.STATUS, payload: AppStatus.RESULT })

  // Encrypt the ballots wiht the received data and dispatch it to the Redux Store
  useEffect(() => {
    encryptionResult = CreateEncryptedBallot(votingQuestions, publicKey, voterPublicKeyH);
    dispatch({
      type: RAT.CALCULATED_BALLOT_HASH,
      payload: {
        hash: crypto.SHA256(JSON.stringify(encryptionResult[0])).toString(),
        verificationResult: encryptionResult[1]
      }
    })
  }, [])

  return (
    <div>
      <div>

        {challengeOrCast == "CAST" &&
          <div className="cardDiv">
            <h1>Cast</h1>
            <p>You selcted cast. Therefore, also select cast on the voting machine.</p>
          </div>
        }

        {challengeOrCast != "CAST" && challengeOrCast != 'CHALLENGE' &&
          <div className="cardDiv">
            <h1>Error</h1>
            <p>You did not scan the commitment.</p>
            <p>Please go back to start and restart the verification</p>
          </div>
        }

        {challengeOrCast == "CHALLENGE" &&
          <div>
            {calculatedBallotHash === '' &&
              <div className="loaderPosition">
                <div className="lds-dual-ring" />
                <div className="loaderText">calculating result...</div>
              </div>
            }
            {calculatedBallotHash !== '' &&
              <div className="cardDiv">
                <h1>Result</h1>
                <div className="centerHorizontally" style={{ alignItems: 'stretch' }}>
                  <div className="cardDivSmall">
                    <h3>Received Hash</h3>
                    <p>{receivedBallotHash}</p>
                    <div className="centerHorizontally" style={{ margin: '2% auto' }}>
                      <Hashicon value={receivedBallotHash} size={usableHeight / 10} />
                    </div>
                  </div>
                  <div className="cardDivSmall">
                    <h3>Calculated Hash</h3>
                    <p>{calculatedBallotHash}</p>
                    <div className="centerHorizontally" style={{ margin: '2% auto' }}>
                      <Hashicon value={calculatedBallotHash} size={usableHeight / 10} />
                    </div>
                  </div>
                </div>
                <h3>Encryption Result</h3>
                {verificationResult &&
                  <div>
                    <div className="centerHorizontally" style={{ margin: '3%' }}>
                      <div style={{ width: usableHeight / 10, height: usableHeight / 10 }}>
                        <svg className="resultSVG" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                          <circle className="pathCircle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                          <polyline className="pathCheck" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
                        </svg>
                      </div>
                    </div>
                    <div className="centerHorizontally">
                      <p className="resultSuccess">Encryption Similar</p>
                    </div>
                  </div>
                }
                {!verificationResult &&
                  <div>
                    <div className="centerHorizontally">
                      <div style={{ width: usableHeight / 10, height: usableHeight / 10 }}>
                        <svg className="resultSVG" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                          <circle className="pathCircle" fill="none" stroke="#ba0000" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                          <line className="pathLine" fill="none" stroke="#ba0000" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
                          <line className="pathLine" fill="none" stroke="#ba0000" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
                        </svg>
                      </div>
                    </div>
                    <div className="centerHorizontally">
                      <p className="resultError">Encryption NOT Similar</p>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

      </div>
      <div className="buttonDivPosition">
        <div className="buttonDiv">
          <div className="buttonStyle">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" fullWidth={true}>Back to Start</Button>
            </Link>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Result;