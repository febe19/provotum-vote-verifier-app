export const getResult = (state: any) => state?.result ?? null;

export const getVotingQuestions = (state: any) => state?.votingQuestions ?? '';

export const getBallotHash = (state: any) => state?.ballotHash ?? '';

export const getCommitmentScanned = (state: any) => state?.commitmentScanned ?? '';

export const getChallengeScanned = (state: any) => state?.challengeScanned ?? '';

export const getPublicKey = (state: any) => state?.publicKey ?? null;

export const getUniqueID = (state: any) => state?.uniqueId ?? null;

export const getVoterPublicKeyH = (state: any) => state?.voterPublicKeyH ?? null;

export const getScannedChallengesNumbers = (state: any) => state?.scannedChallengesNumbers ?? '';

export const getTotalNrOfChallenges = (state: any) => state?.totalNrOfChallenges ?? 0;

export const getShowScanner = (state: any) => state?.showScanner ?? false;

export const getChallengeOrCast = (state: any) => state?.CoC ?? '';




