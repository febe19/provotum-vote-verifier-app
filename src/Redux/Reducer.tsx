import BN from 'bn.js';

export type State = {
    showScanner: Boolean,
    receivedBallotHash: String,
    calculatedBallotHash: String,
    scannedChallengesNumbers: Array<Number>,
    totalNrOfChallenges: Number,
    votingQuestions: Array<any>,
    CoC: String
}

const initState: State = {
    showScanner: true,
    receivedBallotHash: '',
    calculatedBallotHash: '',
    scannedChallengesNumbers: [],
    totalNrOfChallenges: 0,
    votingQuestions: [],
    CoC: ''
};


function Reducer(state: any = initState, action: any) {
    if (action.type != "SCANNER_RESULT") { //TODO: REmove
        console.log("Reducer: ", action)
    }
    switch (action.type) {
        case "SCANNER_RESULT": {
            return {
                ...state,
                result: action.payload
            }
        };
        case "ADD_COMMITMENT_DATA":
            var vQ: Array<any> = []
            Object.entries(action.payload.VotingQuestions).forEach(([key, value]: any) => {
                action.payload.VotingQuestions[key] = { Question: value }
            })

            Object.entries(action.payload.VotingQuestions).forEach(([key, value]: any) => {
                console.log("Key: ", key, " --> ", value)
            })
            
            return {
                ...state,
                receivedBallotHash: action.payload.BH,
                votingQuestions: action.payload.VotingQuestions
            };
        case "ADD_CHALLENGE_DATA":
            if (action.payload.Key != "GeneralData") {

                var key = action.payload.Key

                state.votingQuestions[key] = {
                    Question: state.votingQuestions[key].Question,
                    nonce: (state.votingQuestions[key] ? (state.votingQuestions[key].nonce ? (state.votingQuestions[key].nonce) : (action.payload.Nonce)) : (action.payload.Nonce)),
                    answerBin: (state.votingQuestions[key] ? (state.votingQuestions[key].answerBin !== undefined ? (state.votingQuestions[key].answerBin) : (action.payload.answerBin)) : (action.payload.answerBin)),
                    reEncryptedBallot: (state.votingQuestions[key] ? (state.votingQuestions[key].reEncryptedBallot ? (state.votingQuestions[key].reEncryptedBallot) : (action.payload.reEncryptedBallot)) : (action.payload.reEncryptedBallot)),
                    reEncryptionProof: (state.votingQuestions[key] ? (state.votingQuestions[key].reEncryptionProof ? (state.votingQuestions[key].reEncryptionProof) : (action.payload.reEncryptionProof)) : (action.payload.reEncryptionProof)),
                }

                return {
                    ...state,
                    scannedChallengesNumbers: [...state.scannedChallengesNumbers, action.payload.Counter],
                }

                //votes[key] = objWithHexStrToBn(votes[key])
            }

            if (action.payload.Key == 'GeneralData') {
                return {
                    ...state,
                    publicKey: (state.publicKey ? (state.publicKey) : action.payload.publicKey),
                    voterPublicKeyH: (state.voterPublicKeyH ? (state.voterPublicKeyH) : objWithHexStrToBn(action.payload.voterPublicKeyH)),
                    scannedChallengesNumbers: [...state.scannedChallengesNumbers, action.payload.Counter],
                    totalNrOfChallenges: (state.totalNrOfChallenges ? (state.totalNrOfChallenges) : (action.payload.Total)),
                };
            }

            return {
                ...state
            }
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
        case "CHALLENGE_OR_CHASE":
            return {
                ...state,
                CoC: action.payload,
            }
        case "CALCULATED_BALLOT_HASH":
            return {
                ...state,
                calculatedBallotHash: action.payload,
            }
        default:
            return initState;
    }
}

//This parses an obj to a BN with the according keys used already. Inspired by A.Hoffmann
const objWithHexStrToBn = (obj: any) => {
    if (obj === undefined) {
        console.log("Return undefined for ", obj)
        return
    }

    if (typeof obj === 'string') {
        console.log("Return BN for ", obj)
        return new BN(obj, 16);
    }

    Object.entries(obj).forEach(([key, value]: any) => {
        console.log("obj for Each: ", key, " -> ", value, " ==> ", typeof value)
        if (typeof value === 'object') {
            objWithHexStrToBn(value);
        } else {
            if (value !== undefined) {
                obj[key] = new BN(value.toString(), 16);
            }
        }
    });
};

export default Reducer