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
                <p>RH -- {receivedBallotHash}</p>
                <p>CH -- {calculatedBallotHash}</p>
                <p>Verification Result is: {verificationResult.toString()}</p>
                <Hashicon value={calculatedBallotHash}/>
              </div>
            }
          </div>
        }

      </div>
      <div className="buttonDiv">
        <div className="buttonStyle">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" fullWidth={true}>Back to Start</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Result;