export const getResult = (state: any) => state?.result ?? null;

export const getVotingQuestions = (state: any) => state?.votingQuestions ?? '';

export const getReceivedBallotHash = (state: any) => state?.receivedBallotHash ?? '';

export const getCalculatedBallotHash = (state: any) => state?.calculatedBallotHash ?? '';

export const getCommitmentScanned = (state: any) => state?.commitmentScanned ?? '';

export const getChallengeScanned = (state: any) => state?.challengeScanned ?? '';

export const getPublicKey = (state: any) => state?.publicKey ?? null;

export const getUniqueID = (state: any) => state?.uniqueId ?? null;

export const getVoterPublicKeyH = (state: any) => state?.voterPublicKeyH ?? null;

export const getScannedChallengesNumbers = (state: any) => state?.scannedChallengesNumbers ?? '';

export const getTotalNrOfChallenges = (state: any) => state?.totalNrOfChallenges ?? 0;

export const getShowScanner = (state: any) => state?.showScanner ?? false;

export const getChallengeOrCast = (state: any) => state?.CoC ?? '';

export const getVotes = (state: any) => state?.votes ?? null;




