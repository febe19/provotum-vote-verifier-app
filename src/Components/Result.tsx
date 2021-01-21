import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Link } from 'react-router-dom'
import {
  getChallengeOrCast,
  getReceivedBallotHash,
  getCalculatedBallotHash,
  getVotes,
} from '../Redux/Selector'

import { encrypt } from '@hoal/evote-crypto-ts'

const CreateEncryptedBallot = () => {
  console.log("start Create")
  const votes: Array<any> = useSelector(getVotes)

  console.log("Votes: ", votes)

  const encryptedBallots: Array<any> = []

  Object.entries(votes).forEach(([key, value]) => {
    console.log("Anser Bin: ", value.answerBin)
    const encryptedVote: Array<any> = []
    encryptedVote.push(key);
    encryptedVote.push(value.nonce)
    encryptedVote.push(value.reEncryptedBallot)

    encryptedBallots.push(encryptedVote)
  })


  console.log("encryptedBallots JSON: ", JSON.stringify(encryptedBallots))
  return encryptedBallots
}


const Result = () => {

  // REDUX Stuff
  const dispatch = useDispatch()
  const receivedBallotHash = useSelector(getReceivedBallotHash);
  const calculatedBallotHash = useSelector(getCalculatedBallotHash);
  const challengeOrCast = useSelector(getChallengeOrCast);

  const encryptedBallots: Array<any> = CreateEncryptedBallot();

  console.log("after Create", encryptedBallots)

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