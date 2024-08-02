import { IShipStats } from "../appTypes";

function getRandomNumber(num: number) {
    return Math.ceil(Math.random() * num);
  };

export function makeNewEnemy() {
  const enemy: IShipStats = {
    stamina: getRandomNumber(10),
    speed: getRandomNumber(5),
    attack: getRandomNumber(5),
  };
  return enemy;
};

export function calculateDamage(attacker: IShipStats, defender: IShipStats) {
  // const hitPercent = 50 + ((attacker.speed - defender.speed) * 10);
  // const seed = getRandomNumber(100);
  console.log(attacker.attack, 'attack', defender.stamina, 'stamina');
  return attacker.attack;
//   if (hitPercent > seed) {
//     return attacker.attack;
//   } else {
//     return 0;
//   }
};