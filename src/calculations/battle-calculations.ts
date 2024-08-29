import { IShipStats } from "../appTypes";

function getRandomNumber(num: number) {
    return Math.ceil(Math.random() * num);
  };

function getRandomNumberZero(num: number) {
    return Math.floor(Math.random() * num);
};

const enemyList: IShipStats[] = [
    {
        name: "Pete's Pirates",
        attack: 5,
        stamina: 5,
        speed: 5,
        guts: 5,
    },
    {
        name: "Petra's Pirates",
        attack: 4,
        stamina: 5,
        speed: 7,
        guts: 7,
    },
    {
        name: "The Crude Crew",
        attack: 8,
        stamina: 6,
        speed: 2,
        guts: 10,
    },
    {
        name: "Coconut Crowd",
        attack: 7,
        stamina: 2,
        speed: 7,
        guts: 3,
    },
    {
        name: "Felipe's Fine Friends",
        attack: 3,
        stamina: 8,
        speed: 6,
        guts: 8,
    },
    {
        name: "Crow's Nest Compatriots",
        attack: getRandomNumber(10),
        stamina: getRandomNumber(10),
        speed: getRandomNumber(10),
        guts: getRandomNumber(10),
    },
    {
        name: "Some Saps on a Raft",
        attack: 1,
        stamina: 1,
        speed: 1,
        guts: 1,
    },
];

function makeNewEnemy() {
  const enemy: IShipStats = enemyList[getRandomNumberZero(enemyList.length)];
  return enemy;
};

function calculateHitPercent(attacker: IShipStats, defender: IShipStats) {
  return 50 + ((attacker.speed - defender.speed) * 5);
};

function calculateDamage(attacker: IShipStats, defender: IShipStats): [number, string] {
  const hitPercent = calculateHitPercent(attacker, defender);
  const seed = getRandomNumber(100);
  console.log(seed)
  const [calculatedDamage, message] = calculateGutsiness(attacker.attack, attacker.guts, defender.guts);
  if (hitPercent >= seed) {
    return [calculatedDamage, message];
  } else {
    return [0, 'Miss!'];
  }
};

function calculateGutsiness(rawAttack: number, attackerGuts: number, defenderGuts: number): [number, string] {
  const seed = getRandomNumberZero(100);
  const calculatedGuts = attackerGuts - defenderGuts;
  if (calculatedGuts >= seed) {
    return [rawAttack * 2, 'What a hit!!!!'];
  } else {
    return [rawAttack, 'A hit!'];
  }
};

export const battleCalculations = {
  calculateGutsiness,
  calculateDamage,
  calculateHitPercent,
  makeNewEnemy,
  enemyList,
  getRandomNumber,
  getRandomNumberZero
};