const initState = {
    showScanner: true,
    scannedChallengesNumbers: [],
    totalNrOfChallenges: 0,
    publicKey: null,
    voterPublicKeyH: null,
    uniqueID: null,
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

            return {
                ...state,
                publicKey: action.payload.publicKey ?? state.publicKey,
                voterPublicKeyH: action.payload.voterPublicKeyH ?? state.voterPublicKeyH,
                uniqueID: action.payload.uniqueID ?? state.uniqueID,
                scannedChallengesNumbers: [...state.scannedChallengesNumbers, action.payload.Counter],
                totalNrOfChallenges: action.payload.Total,
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
            return initState
        default:
            return initState;
    }
}

export default Reducer