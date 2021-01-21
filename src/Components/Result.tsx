import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Link } from 'react-router-dom'
import {
  getChallengeOrCast,
  getReceivedBallotHash,
  getCalculatedBallotHash,
  getVotes,
} from '../Redux/Selector'
import CircularProgress from '@material-ui/core/CircularProgress';

import { encrypt } from '@hoal/evote-crypto-ts'

const createEncryptedBallot = () => async (dispatch: any) => {

  const votes = useSelector(getVotes)

  console.log(votes)
}


const Result = () => {

  // REDUX Stuff
  const dispatch = useDispatch()
  const receivedBallotHash = useSelector(getReceivedBallotHash);
  const calculatedBallotHash = useSelector(getCalculatedBallotHash);
  const challengeOrCast = useSelector(getChallengeOrCast);

  createEncryptedBallot();

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
          {calculatedBallotHash !== null ?? <div>
            <CircularProgress />
            <p>Encryption in Progress</p>
          </div>}
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