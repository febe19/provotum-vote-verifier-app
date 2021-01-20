import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Link } from 'react-router-dom'
import {
  getChallengeOrCast,
  getBallotHash,
} from '../Redux/Selector'

import { encrypt } from '@hoal/evote-crypto-ts'

const Result = () => {

  // REDUX Stuff
  const dispatch = useDispatch()
  const ballotHash = useSelector(getBallotHash);
  const challengeOrCast = useSelector(getChallengeOrCast);

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
          <p>Encryption in Progress</p>
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