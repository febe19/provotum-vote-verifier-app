export const getResult = (state: any) => state?.result ?? null;

export const getVotingQuestions = (state: any) => state?.votingQuestions ?? '';

export const getReceivedBallotHash = (state: any) => state?.receivedBallotHash ?? '';

export const getCalculatedBallotHash = (state: any) => state?.calculatedBallotHash ?? '';

export const getVerificationResult = (state: any) => state?.verificationResult ?? false;

export const getCommitmentScanned = (state: any) => state?.commitmentScanned ?? '';

export const getChallengeScanned = (state: any) => state?.challengeScanned ?? '';

export const getPublicKey = (state: any) => state?.publicKey ?? null;

export const getVoterPublicKeyH = (state: any) => state?.voterPublicKeyH ?? null;

export const getScannedChallengesNumbers = (state: any) => state?.scannedChallengesNumbers ?? '';

export const getTotalNrOfChallenges = (state: any) => state?.totalNrOfChallenges ?? 0;

export const getShowScanner = (state: any) => state?.showScanner ?? false;

export const getChallengeOrCast = (state: any) => state?.CoC ?? '';

export const getHeight = (state: any) => state?.windowHeight ?? '';

export const getMaxScannerHeight = (state: any) => state?.maxScannerHeight ?? '';

export const getMaxScannerWidth = (state: any) => state?.maxScannerWidth ?? '';

export const getAppStatus = (state: any) => state?.status ?? '';





