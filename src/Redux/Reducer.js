const initState = {
    showScanner: true
};


function Reducer(state = initState, action) {
    console.log("Reducer: ", action)
    switch (action.type) {
        case "ADD_COMMITMENT_DATA":
            return {
                ...state,
                ballotHash: action.payload.BH,
                publicKey: action.payload.publicKey,
                voterPublicKeyH: action.payload.voterPublicKeyH,
                uniqueID: action.payload.uniqueID,
            };
        case "ADD_CHALLENGE_DATA":
            return {
                ...state,
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
            return state = undefined
        default:
            return initState;
    }
}

export default Reducer