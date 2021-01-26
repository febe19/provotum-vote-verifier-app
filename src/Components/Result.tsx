import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { bnToHex, hexToBn, u8aToHex } from '@polkadot/util';
import { Link } from 'react-router-dom'
import BN from 'bn.js';
import * as crypto from "crypto-js";

import {
  getChallengeOrCast,
  getReceivedBallotHash,
  getCalculatedBallotHash,
  getVotingQuestions,
  getPublicKey,
  getVoterPublicKeyH,
} from '../Redux/Selector'

import {
  encrypt,
  verifyReEncryptionProof,
  ElGamalPublicKey,
} from '@hoal/evote-crypto-ts'

function CreateEncryptedBallot(votingQuestions: Array<any>, publicKey: ElGamalPublicKey, voterPublicKeyH: BN) {
  console.log("start Create")
  var allVerified: any = null
  var verifies: Boolean = false

  console.log("Votes: ", votingQuestions)

  const encryptedBallots: Array<any> = []

  Object.entries(votingQuestions).forEach(([key, value]) => {
    console.log("-----Start for key: ", key)
    if (value.answerBin === undefined) {
      console.log("-----End for key: ", key, " due to no answer given")
      return
    }
    const encryptedVote: Array<any> = []

    const encryptedBallot = encrypt(value.answerBin, publicKey, value.nonce);

    console.log("Encryption Done for: ", value)

    var verifies = verifyReEncryptionProof(
      value.reEncryptionProof,
      value.reEncryptedBallot,
      encryptedBallot,
      publicKey,
      voterPublicKeyH,
    );

    allVerified = allVerified !== null ? (verifies && allVerified ? (true) : (false)) : (verifies)

    const cipherToSubstrate = {
      c: bnToHex(value.reEncryptedBallot.c),
      d: bnToHex(value.reEncryptedBallot.d),
    };

    encryptedVote.push(key);
    encryptedVote.push(cipherToSubstrate);


    encryptedBallots.push(encryptedVote)
    console.log("-----End for key: ", key)
  })


  console.log("encryptedBallots JSON: ", JSON.stringify(encryptedBallots))

  verifies = allVerified !== null ? (allVerified) : (false)
  return [encryptedBallots, verifies]

}


const Result = () => {

  // REDUX Stuff
  const dispatch = useDispatch()
  const receivedBallotHash = useSelector(getReceivedBallotHash);
  const calculatedBallotHash = useSelector(getCalculatedBallotHash);
  const challengeOrCast = useSelector(getChallengeOrCast);
  const votingQuestions: Array<any> = useSelector(getVotingQuestions)
  const publicKey: ElGamalPublicKey = useSelector(getPublicKey)
  const voterPublicKeyH: BN = useSelector(getVoterPublicKeyH)
  var encryptionResult: Array<any> = []

  useEffect(() => {
    console.log("RESULT - UseEffect")
    encryptionResult = CreateEncryptedBallot(votingQuestions, publicKey, voterPublicKeyH);
    console.log("Encrypted Ballots:", encryptionResult[0])
    console.log("All Verified:", encryptionResult[1])

    dispatch({
      type: "CALCULATED_BALLOT_HASH",
      payload: crypto.SHA256(JSON.stringify(encryptionResult[0])).toString()
    })
    console.log("CalculatedBallotHash: ", crypto.SHA256(JSON.stringify(encryptionResult[0])).toString())


  }, [])

  

  return (
    <div>
      <h1>Result</h1>

      {challengeOrCast == "CAST" &&
        <div>
          <p>Your ballot was cast. So you finished voting</p>
        </div>
      }

      {challengeOrCast != "CAST" && challengeOrCast != 'CHALLENGE' &&
        <div>
          <p>You did not scan the commitment.</p>
          <p>Please go back to the Homescreen and restart the verification</p>
        </div>
      }

      {challengeOrCast == "CHALLENGE" &&
        <div>
          <div>RH -- {receivedBallotHash}</div>
          <div>CH -- {calculatedBallotHash}</div>
        </div>
      }

      <div>
        <Link to="/">
          <button>Back to Homescreen</button>
        </Link>
      </div>
    </div>
  )
}

export default Result;