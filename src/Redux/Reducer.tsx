import BN from 'bn.js';

// ReduxActionType (RAT) Definitions
export enum RAT {
    SCANNER_RESULT = "SCANNED_RESULT",
    ADD_COMMITMENT_DATA = "ADD_COMMITMENT_DATA",
    ADD_CHALLENGE_DATA = "ADD_CHALLENGE_DATA",
    COMMITMENT_SCANNED = "COMMITMENT_SCANNED",
    CHALLENGE_SCANNED = "CHALLENGE_SCANNED",
    SHOW_SCANNER = "SHOW_SCANNER",
    HIDE_SCANNER = "HIDE_SCANNER",
    RESET = "RESET",
    CHALLENGE_OR_CAST = "CHALLENGE_OR_CAST",
    CALCULATED_BALLOT_HASH = "CALCULATED_BALLOT_HASH",
}

//Redux State Type-Definition
export type State = {
    showScanner: Boolean,
    commitmentScanned: Boolean,
    challengeScanned: Boolean,
    receivedBallotHash: String,
    calculatedBallotHash: String,
    scannedChallengesNumbers: Array<Number>,
    totalNrOfChallenges: Number,
    votingQuestions: Array<any>,
    CoC: String,
    result: String,
    verificationResult: Boolean
}

// Redux Initial State definition
const initState: State = {
    showScanner: true,
    commitmentScanned: false,
    challengeScanned: false,
    receivedBallotHash: '',
    calculatedBallotHash: '',
    scannedChallengesNumbers: [],
    totalNrOfChallenges: 1,
    votingQuestions: [],
    CoC: '',
    result: '',
    verificationResult: false
};


function Reducer(state: any = initState, action: any) {
    if (action.type != "SCANNER_RESULT") { //TODO: Remove
        console.log("Reducer: ", action)
    }

    switch (action.type) {
        case RAT.SCANNER_RESULT: {
            return {
                ...state,
                result: action.payload
            }
        };
        case RAT.COMMITMENT_SCANNED:
            return {
                ...state,
                commitmentScanned: true,
            };
        case RAT.CHALLENGE_SCANNED:
            return {
                ...state,
                challengeScanned: true,
            };
        case RAT.SHOW_SCANNER:
            return {
                ...state,
                showScanner: true,
            };
        case RAT.HIDE_SCANNER:
            return {
                ...state,
                showScanner: false,
            };
        case RAT.CHALLENGE_OR_CAST:
            return {
                ...state,
                CoC: action.payload,
            }
        case RAT.ADD_COMMITMENT_DATA:
            // Add thequestion to a field 'Question' instead of directly to the key
            Object.entries(action.payload.VotingQuestions).forEach(([key, value]: any) => {
                action.payload.VotingQuestions[key] = { Question: value }
            })

            return {
                ...state,
                receivedBallotHash: action.payload.BH,
                votingQuestions: action.payload.VotingQuestions
            };
        case RAT.ADD_CHALLENGE_DATA:
            // Add non-General Data (actual Voting Question data) to the state and return it
            if (action.payload.Key != "GeneralData") {
                var key = action.payload.Key
                state.votingQuestions[key] = {
                    Question: state.votingQuestions[key].Question,
                    nonce: (state.votingQuestions[key] ? (state.votingQuestions[key].nonce ? (state.votingQuestions[key].nonce) : objWithHexStrToBn(action.payload.Nonce)) : objWithHexStrToBn(action.payload.Nonce)),
                    answerBin: (state.votingQuestions[key] ? (state.votingQuestions[key].answerBin !== undefined ? (state.votingQuestions[key].answerBin) : (action.payload.answerBin)) : (action.payload.answerBin)),
                    reEncryptedBallot: (state.votingQuestions[key] ? (state.votingQuestions[key].reEncryptedBallot ? (state.votingQuestions[key].reEncryptedBallot) : objWithHexStrToBn(action.payload.reEncryptedBallot)) : objWithHexStrToBn(action.payload.reEncryptedBallot)),
                    reEncryptionProof: (state.votingQuestions[key] ? (state.votingQuestions[key].reEncryptionProof ? (state.votingQuestions[key].reEncryptionProof) : objWithHexStrToBn(action.payload.reEncryptionProof)) : objWithHexStrToBn(action.payload.reEncryptionProof)),
                }

                return {
                    ...state,
                    scannedChallengesNumbers: [...state.scannedChallengesNumbers, action.payload.Counter],
                    totalNrOfChallenges: action.payload.Total,
                }
            }

            if (action.payload.Key == 'GeneralData') {
                // Add General Data (Public Key)
                return {
                    ...state,
                    publicKey: objWithHexStrToBn(action.payload.publicKey),
                    voterPublicKeyH: objWithHexStrToBn(action.payload.voterPublicKeyH),
                    scannedChallengesNumbers: [...state.scannedChallengesNumbers, action.payload.Counter],
                    totalNrOfChallenges: action.payload.Total,
                };
            }

            return {
                ...state
            }
        case RAT.CALCULATED_BALLOT_HASH:
            return {
                ...state,
                calculatedBallotHash: action.payload.hash,
                verificationResult: action.payload.verificationResult
            }
        case RAT.RESET:
            return initState;
        default:
            return initState;
    }
}

// This parses an obj to a BN recursively with the according keys used already. Inspired by A.Hoffmann
const objWithHexStrToBn = (obj: any) => {
    if (obj === undefined) {
        return
    }

    if (typeof obj === 'string') {
        return new BN(obj, 16);
    }

    Object.entries(obj).forEach(([key, value]: any) => {
        if (typeof value === 'object') {
            objWithHexStrToBn(value);
        } else {
            obj[key] = new BN(value.toString(), 16);
        }
    });

    return obj;
};

export default Reducer