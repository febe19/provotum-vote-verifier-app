const initState = {
    showScanner: true,
    scannedChallengesNumbers: [],
    totalNrOfChallenges: 0,
    publicKey: null,
    voterPublicKeyH: null,
    uniqueID: null,
    votes: {}
};


function Reducer(state = initState, action) {
    if (action.type != "RESULT") {
        console.log("Reducer: ", action)
    }
    //publicKey: action.payload.publicKey,
    //voterPublicKeyH: action.payload.voterPublicKeyH,
    //uniqueID: action.payload.uniqueID,

    switch (action.type) {
        case "RESULT": {
            return {
                ...state,
                result: action.payload
            }
        };
        case "ADD_COMMITMENT_DATA":
            return {
                ...state,
                ballotHash: action.payload.BH,
                votingQuestions: action.payload.VotingQuestions
            };
        case "ADD_CHALLENGE_DATA":
            console.log("Reducer Payload: ", action.payload)

            
            var votes = state.votes
            if (action.payload.Key != "GeneralData") {
                var key = action.payload.Key
                votes[key] = {
                    nonce: (state.votes[key] ? (state.votes[key].nonce ? (state.votes[key].nonce):(action.payload.Nonce)):(action.payload.Nonce)),
                    answerBin: (state.votes[key] ? (state.votes[key].answerBin !== undefined ? (state.votes[key].answerBin):(action.payload.answerBin)):(action.payload.answerBin)),
                    reEncryptedBallot: (state.votes[key] ? (state.votes[key].reEncryptedBallot ? (state.votes[key].reEncryptedBallot):(action.payload.reEncryptedBallot)):(action.payload.reEncryptedBallot)),
                    reEncryptionProof: (state.votes[key] ? (state.votes[key].reEncryptionProof ? (state.votes[key].reEncryptionProof):(action.payload.reEncryptionProof)):(action.payload.reEncryptionProof)),
                }
            }
            
            return {
                ...state,
                publicKey: (state.publicKey ? (state.publicKey) : (action.payload.publicKey)),
                voterPublicKeyH: (state.voterPublicKeyH ? (state.voterPublicKeyH):(action.payload.voterPublicKeyH)),
                uniqueID: (state.uniqueID ? (state.uniqueID):(action.payload.uniqueID)),
                scannedChallengesNumbers: [...state.scannedChallengesNumbers, action.payload.Counter],
                totalNrOfChallenges: (state.totalNrOfChallenges ? (state.totalNrOfChallenges):(action.payload.Total)),
                votes: votes
            };
        case "COMMITMENT_SCANNED":
            return {
                ...state,
                commitmentScanned: true,
            };
        case "CHALLENGE_SCANNED":
            return {
                ...state,
                challengeScanned: true,
            };
        case "SHOW_SCANNER":
            return {
                ...state,
                showScanner: true,
            };
        case "HIDE_SCANNER":
            return {
                ...state,
                showScanner: false,
            };
        case "START_UP":
            return {
                ...initState, 
                votes: {}
            };
        default:
            return initState;
    }
}

export default Reducer