export const getResult = (state) => state?.result ?? null;

export const getBallotHash = (state) => state?.ballotHash ?? '';

export const getCommitmentScanned = (state) => state?.commitmentScanned ?? '';

export const getChallengeScanned = (state) => state?.challengeScanned ?? '';

export const getScannedChallengesNumbers = (state) => state?.scannedChallengesNumbers ?? '';

export const getTotalNrOfChallenges = (state) => state?.totalNrOfChallenges ?? 0;


export const getShowScanner = (state) => state?.showScanner ?? false;




