type islandStyleArray = [number, number, string, string, number, treasureTrapTypes];
type islandAttributes = Map<number, islandStyleArray>
type treasureTrapTypes = 'chest' | 'pit' | 'snake' | 'fruit' | 'nothing' | 'enemy';
type treasureTrapMessageData = [treasureTrapTypes, number, string];
type treasureTrapObject = Record<treasureTrapTypes, treasureTrapMessageData>;
type highScoreListType = Array<[number, string]>;
type gameStateTypes = 'login' | 'newGame' | 'playingGame' | 'finishedGame';
type dialogTypes = 'rest' | 'move' | 'points' | 'none';
type pieceTypes = 'sail' | 'cargo';
type queryMessageType = [treasureTrapTypes | 'query', number, string];
type dbHighScores = {
    id: number,
    name: string,
    score: number
};

interface IgameSaveData {
    chosenPieceType: string;
    currentPlayerPosition: number;
    numberOfSquares: number;
    userName: string;
    chosenIslandData: islandAttributes;
    currentScore: number;
    currentStamina: number;
};

interface IdataToSaveAsJson {
    chosenIslandData: Record<string, islandStyleArray>;
    currentScore: number;
    currentStamina: number;
    chosenPieceType: string;
    currentPlayerPosition: number;
    numberOfSquares: number;
    userName: string;
};

interface IShipStats {
    name: string;
    stamina: number;
    attack: number;
    speed: number;
    guts: number;
}

type userIsRegistered = (yes: boolean) => void;
type rollDie = (num: number) => void;
type handleHover = (dialogType: dialogTypes) => void;
/** Sets user name to show on screen, and either starts game from save or moves to set up step if no save */
type displayUserName = (name: string, hasSetup: boolean) => void;
/** Progresses window to next step, either closing it, or changing text if player explores */
type messageWindowClose = (onlyClose: boolean, battle: boolean) => void;
type changeNumberOfSquares = (num: number, stamina: number, points: number) => void;
type changePieceType = (type: pieceTypes) => void;
/** Either recreates islands from saved data or creates from scratch */
type makeSquares = (num: number, data: islandAttributes | null, score: number, stamina: number, position: number) => void;
/** Tries to restore game either from local storage or DB and informs if successful */
type restoreGameFromLocalOrDB = (name: string) => Promise<boolean>;
/** Changes stamina if attack succeeds */
type changeStaminaFromAttack = (newStamina: number) => void;
/** Ends battle and set loss condition or adds to points */
type endBattle = (loss: boolean, points: number) => void;

export type {
    islandStyleArray,
    islandAttributes,
    treasureTrapTypes,
    treasureTrapMessageData,
    treasureTrapObject,
    highScoreListType,
    gameStateTypes,
    dialogTypes,
    queryMessageType,
    userIsRegistered,
    IgameSaveData,
    rollDie,
    handleHover,
    displayUserName,
    restoreGameFromLocalOrDB,
    messageWindowClose,
    changeNumberOfSquares,
    changePieceType,
    pieceTypes,
    makeSquares,
    dbHighScores,
    IdataToSaveAsJson,
    IShipStats,
    changeStaminaFromAttack,
    endBattle,
}