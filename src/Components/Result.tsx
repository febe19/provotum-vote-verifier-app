import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { bnToHex } from '@polkadot/util';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import BN from 'bn.js';
import * as crypto from "crypto-js";
import { Hashicon } from '@emeraldpay/hashicon-react';
import {
  RAT
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

  // Encrypt the ballots wiht the received data and dispatch it to the Redux Store
  useEffect(() => {
    encryptionResult = CreateEncryptedBallot(votingQuestions, publicKey, voterPublicKeyH);
    console.log("Encrypted Ballots:", encryptionResult[0])
    console.log("All Verified:", encryptionResult[1])
    console.log("CalculatedBallotHash: ", crypto.SHA256(JSON.stringify(encryptionResult[0])).toString())

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

            <p>Your selcted cast. Therefore, also select cast on the voting machine</p>
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
                <h3>Received Hash</h3>
                <p>{receivedBallotHash}</p>
                <div className="centerHorizontally">
                  <Hashicon value={receivedBallotHash} size={usableHeight / 10} />
                </div>
                <h3>Calculated Hash</h3>
                <p>{calculatedBallotHash}</p>
                <div className="centerHorizontally">
                  <Hashicon value={calculatedBallotHash} size={usableHeight / 10} />
                </div>
                <h3>Verification Result</h3>
                {verificationResult &&
                  <div>
                    <div className="centerHorizontally">
                      <div style={{ width: usableHeight / 10, height: usableHeight / 10 }}>
                        <svg className="resultSVG" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                          <circle className="pathCircle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                          <polyline className="pathCheck" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
                        </svg>
                      </div>
                    </div>
                    <div className="centerHorizontally">
                      <p className="resultSuccess">Device trustworthy</p>
                    </div>
                  </div>
                }
                {!verificationResult &&
                  <div>
                    <div className="centerHorizontally">
                      <div style={{ width: usableHeight / 10, height: usableHeight / 10 }}>
                        <svg className="resultSVG" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                          <circle className="pathCircle" fill="none" stroke="#ba0000" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                          <line className="pathLine" fill="none" stroke="#ba0000" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
                          <line className="pathLine" fill="none" stroke="#ba0000" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
                        </svg>
                      </div>
                    </div>
                    <div className="centerHorizontally">
                      <p className="resultError">Device NOT trustworthy</p>
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