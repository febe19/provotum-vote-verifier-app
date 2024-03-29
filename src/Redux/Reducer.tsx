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
    WINDOWHEIGHT = "WINDOWHEIGHT",
    MAXSCANNERSIZE = "MAXSCANNERSIZE",
    STATUS = "STATUS",
    HELP_OPEN = "HELP_OPEN",
    SELECTION_CONFIRMED = "SELECTION_CONFIRMED",
    ERROR = "ERROR",
}

export enum AppStatus {
    INTRO = "INTRO",
    NOT_FOUND = "NOTFOUND",
    SCAN_COMMITMENT ="SCAN_COMMITMENT",
    SCAN_CHALLENGE = "SCAN_CHALLENGE",
    CHALLENGE_OR_CAST = "CHALLENGE_OR_CAST",
    RESULT = "RESULT",
    CONFIRM_SELECTION = "CONFIRM_SELECTION"
}

//Redux State Type-Definition
export type State = {
    status: AppStatus,
    showScanner: Boolean,
    commitmentScanned: Boolean,
    challengeScanned: Boolean,
    receivedBallotHash: String,
    calculatedBallotHash: String,
    scannedChallengesNumbers: Array<any>,
    totalNrOfChallenges: number,
    votingQuestions: Array<any>,
    CoC: String,
    result: String,
    verificationResult: Boolean,
    windowHeight: number,
    maxScannerWidth: number,
    helpOpen: Boolean,
    selectionConfirmed: Boolean,
    error: String,
}

// Redux Initial State definition
const initState: State = {
    status: AppStatus.INTRO,
    showScanner: true,
    commitmentScanned: false,
    challengeScanned: false,
    receivedBallotHash: '',
    calculatedBallotHash: '',
    scannedChallengesNumbers: [],
    totalNrOfChallenges: 0,
    votingQuestions: [],
    CoC: '',
    result: '',
    verificationResult: false,
    windowHeight: 0,
    maxScannerWidth: 0,
    helpOpen: false,
    selectionConfirmed: false,
    error: '',
};


function Reducer(state: any = initState, action: any) {
    switch (action.type) {
        case RAT.WINDOWHEIGHT: {
            return {
                ...state,
                windowHeight: action.payload
            }
        };
        case RAT.MAXSCANNERSIZE: {
            return {
                ...state,
                maxScannerHeight: action.payload[0],
                maxScannerWidth: action.payload[1]
            }
        };
        case RAT.HELP_OPEN: {
            return {
                ...state, 
                helpOpen: action.payload,
                result: null,
            }
        }
        case RAT.ERROR: {
            return {
                ...state, 
                error: action.payload,
                result: null,
            }
        }
        case RAT.STATUS: {
            return {
                ...state,
                status: action.payload
            }
        };
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
        case RAT.SELECTION_CONFIRMED: {
            return {
                ...state, 
                selectionConfirmed: action.payload
            }
        }
        case RAT.ADD_COMMITMENT_DATA:
            // Add thequestion to a field 'Question' instead of directly to the key
            Object.entries(action.payload.VotingQuestions).forEach(([key, value]: any) => {
                action.payload.VotingQuestions[key] = { Question: value }
            })

            return {
                ...state,
                receivedBallotHash: action.payload.BH.match(/.{1,2}/g).join(' '),
                votingQuestions: action.payload.VotingQuestions
            };
        case RAT.ADD_CHALLENGE_DATA:

            // Create Array and set scanend array to true
            if (state.scannedChallengesNumbers === [] || state.scannedChallengesNumbers.length == 0) {
                state.scannedChallengesNumbers = new Array(action.payload.Total).fill(false)
            }
            state.scannedChallengesNumbers[action.payload.Counter] = true

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
                    scannedChallengesNumbers: [...state.scannedChallengesNumbers],
                    totalNrOfChallenges: action.payload.Total,
                }
            }

            // Add General Data (Public Key)
            if (action.payload.Key == 'GeneralData') {
                return {
                    ...state,
                    publicKey: objWithHexStrToBn(action.payload.publicKey),
                    voterPublicKeyH: objWithHexStrToBn(action.payload.voterPublicKeyH),
                    scannedChallengesNumbers: [...state.scannedChallengesNumbers],
                    totalNrOfChallenges: action.payload.Total,
                };
            }
            return {
                ...state
            }
        case RAT.CALCULATED_BALLOT_HASH:
            return {
                ...state,
                calculatedBallotHash: action.payload.hash.match(/.{1,2}/g).join(' '),
                verificationResult: action.payload.verificationResult
            }
        case RAT.RESET:
            return {
                ...initState,
                windowHeight: state.windowHeight
            };
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