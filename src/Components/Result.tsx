import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { bnToHex, hexToBn, u8aToHex } from '@polkadot/util';
import { Link } from 'react-router-dom'
import BN from 'bn.js';
import sha256 from 'crypto-js/sha256';

import {
  getChallengeOrCast,
  getReceivedBallotHash,
  getCalculatedBallotHash,
  getVotes,
  getPublicKey,
  getVoterPublicKeyH,
} from '../Redux/Selector'

import {
  encrypt,
  verifyReEncryptionProof,
  ElGamalPublicKey
} from '@hoal/evote-crypto-ts'

const CreateEncryptedBallot = () => {
  console.log("start Create")
  const votes: Array<any> = useSelector(getVotes)
  const publicKey: ElGamalPublicKey = useSelector(getPublicKey)
  const voterPublicKeyH: BN = useSelector(getVoterPublicKeyH)
  var allVerified: any = null

  console.log("Votes: ", votes)

  const encryptedBallots: Array<any> = []

  Object.entries(votes).forEach(([key, value]) => {
    console.log("Anser Bin: ", value.answerBin)
    const encryptedVote: Array<any> = []

    //const encryptedBallot = encrypt(value.answerBin, publicKey, value.nonce);

    //var verifies = verifyReEncryptionProof(
    //  value.reEncryptionProof,
    //  value.reEncryptedBallot,
    //  encryptedBallot,
    //  publicKey,
    //  voterPublicKeyH,
    //);

    //allVerified = allVerified !== null ? (verifies && allVerified ? (true) : (false)) : (verifies)

    const cipherToSubstrate = {
      c: bnToHex(value.reEncryptedBallot.c),
      d: bnToHex(value.reEncryptedBallot.c),
    };

    encryptedVote.push(key);
    encryptedVote.push(cipherToSubstrate);


    encryptedBallots.push(encryptedVote)
  })


  console.log("encryptedBallots JSON: ", JSON.stringify(encryptedBallots))

  return [encryptedBallots, allVerified]
  
}


const Result = () => {

  // REDUX Stuff
  const dispatch = useDispatch()
  const receivedBallotHash = useSelector(getReceivedBallotHash);
  const calculatedBallotHash = useSelector(getCalculatedBallotHash);
  const challengeOrCast = useSelector(getChallengeOrCast);

  const encryptedBallots: Array<any> = CreateEncryptedBallot();
  console.log("after Create", encryptedBallots)

  dispatch({
    type: "CALCULATED_BALLOT_HASH",
    payload: sha256(JSON.stringify(encryptedBallots)).toString()
  }) 
  console.log("CalculatedBallotHash: ", sha256(JSON.stringify(encryptedBallots)).toString())

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
          <div>ReceivedBallotHash: {receivedBallotHash}</div>
          <div>Calculated BallotHash: {calculatedBallotHash}</div>
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