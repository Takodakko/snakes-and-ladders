type styleAttributesType = [number, number, string, string, number];
type squareStyleArray = [number, number, string, string, number];
type squareStyleAttributes = Map<number, squareStyleArray>
type treasureTrapTypes = 'chest' | 'pit' | 'snake' | 'fruit' | 'nothing';
type treasureTypeArray = Array<[treasureTrapTypes, number, string]>;
type treasureTrapMap = Map<number, [treasureTrapTypes, number, string]>;
type highScoreListType = Array<[number, string]>;
type gameStateTypes = 'login' | 'newGame' | 'playingGame' | 'wonGame';
type dialogTypes = 'rest' | 'move' | 'points' | 'none';
type pieceTypes = 'sail' | 'cargo';
type queryMessageType = [treasureTrapTypes | 'query', number, string];

interface IgameSaveData {
    numberOnDie: number;
    canRollDie: boolean;
    chosenPieceType: string;
    currentPlayerPosition: number;
    numberOfSquares: number;
    gameState: gameStateTypes;
    userName: string;
    chosenSquareData: squareStyleAttributes;
    currentScore: number;
    showMessage: boolean;
    messageContent: queryMessageType;
    currentStamina: number;
    treasuresAndTrapsData: treasureTrapMap;
};

type userIsRegistered = (yes: boolean) => void;
type rollDie = (num: number) => void;
type handleHover = (dialogType: dialogTypes) => void;
/** Sets user name to show on screen, and either starts game from save or moves to set up step if no save */
type displayUserName = (name: string, hasSetup: boolean) => void;
/** Restores save data for logged in user who saved game previously */
type restoreGame = (data: Record<string, any>) => void;
/** Progresses window to next step, either closing it, or changing text if player explores */
type messageWindowClose = (onlyClose: boolean) => void;
type changeNumberOfSquares = (num: number, stamina: number, points: number) => void;
type changePieceType = (type: string) => void;
/** Either recreates islands from saved data or creates from scratch */
type makeSquares = (num: number, data: squareStyleAttributes | null) => void;
/** Either uses saved data or creates treasure and trap data from scratch */
type makeTreasure = (num: number, data: treasureTrapMap | null) => void;

export type {
    styleAttributesType,
    squareStyleArray,
    squareStyleAttributes,
    treasureTrapTypes,
    treasureTypeArray,
    treasureTrapMap,
    highScoreListType,
    gameStateTypes,
    dialogTypes,
    queryMessageType,
    userIsRegistered,
    IgameSaveData,
    rollDie,
    handleHover,
    displayUserName,
    restoreGame,
    messageWindowClose,
    changeNumberOfSquares,
    changePieceType,
    pieceTypes,
    makeSquares,
    makeTreasure,
}