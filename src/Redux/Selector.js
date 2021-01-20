export const getResult = (state) => state?.result ?? null;

export const getVotingQuestions = (state) => state?.votingQuestions ?? '';

export const getBallotHash = (state) => state?.ballotHash ?? '';

export const getCommitmentScanned = (state) => state?.commitmentScanned ?? '';

export const getChallengeScanned = (state) => state?.challengeScanned ?? '';

export const getPublicKey = (state) => state?.publicKey ?? null;

export const getUniqueID = (state) => state?.uniqueId ?? null;

export const getVoterPublicKeyH = (state) => state?.voterPublicKeyH ?? null;

export const getScannedChallengesNumbers = (state) => state?.scannedChallengesNumbers ?? '';

export const getTotalNrOfChallenges = (state) => state?.totalNrOfChallenges ?? 0;

export const getShowScanner = (state) => state?.showScanner ?? false;

export const getChallengeOrCast = (state) => state?.CoC ?? '';




