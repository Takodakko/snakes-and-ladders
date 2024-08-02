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
        speed: 5
    },
    {
        name: "Petra's Pirates",
        attack: 4,
        stamina: 5,
        speed: 7
    },
    {
        name: "The Crude Crew",
        attack: 8,
        stamina: 6,
        speed: 2
    },
    {
        name: "Coconut Crowd",
        attack: 7,
        stamina: 2,
        speed: 7
    },
    {
        name: "Felipe's Fine Friends",
        attack: 3,
        stamina: 8,
        speed: 6
    },
    {
        name: "Crow's Nest Compatriots",
        attack: getRandomNumber(10),
        stamina: getRandomNumber(10),
        speed: getRandomNumber(10)
    },
    {
        name: "Some Saps on a Raft",
        attack: 1,
        stamina: 1,
        speed: 1
    },
];

export function makeNewEnemy() {
  const enemy: IShipStats = enemyList[getRandomNumberZero(enemyList.length)];
  return enemy;
};

export function calculateHitPercent(attacker: IShipStats, defender: IShipStats) {
  return 50 + ((attacker.speed - defender.speed) * 5);
};

export function calculateDamage(attacker: IShipStats, defender: IShipStats) {
  const hitPercent = calculateHitPercent(attacker, defender);
  const seed = getRandomNumber(100);
  console.log(attacker.attack, 'attack', defender.stamina, 'stamina');
  //return attacker.attack;
  if (hitPercent > seed) {
    return attacker.attack;
  } else {
    return 0;
  }
};