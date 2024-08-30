import { describe, expect, test } from 'vitest';
import { battleCalculations } from '../../calculations/battle-calculations';
const { makeNewEnemy, calculateHitPercent, calculateDamage } = battleCalculations;
import { IShipStats } from "../../appTypes";
import mockData from '../mocks/mockData';
const { mockShipAllFive, mockShipAllTen, mockShipTestCrit, mockShipTestMiss, mockShipTestNormalHit } = mockData;

describe('battle calculation functions', () => {
    test('makeNewEnemy creates a new enemy', () => {
      const enemy: IShipStats = makeNewEnemy();
      expect(enemy).toBeTruthy();
      expect(enemy).toHaveProperty('name');
      expect(enemy).toHaveProperty('attack');
      expect(enemy).toHaveProperty('stamina');
      expect(enemy).toHaveProperty('speed');
      expect(enemy).toHaveProperty('guts');
      expect(typeof enemy.name).toBe('string');
      expect(typeof enemy.attack).toBe('number');
      expect(typeof enemy.stamina).toBe('number');
      expect(typeof enemy.speed).toBe('number');
      expect(typeof enemy.guts).toBe('number');
    });

    test("calculateHitPercents uses two ships to calculate the attacker's hit rate", () => {
      const rate1 = calculateHitPercent(mockShipAllFive, mockShipAllTen);
      expect(rate1).toBe(25);
      const rate2 = calculateHitPercent(mockShipAllTen, mockShipAllFive);
      expect(rate2).toBe(75);
      const rate3 = calculateHitPercent(mockShipAllFive, mockShipAllFive);
      expect(rate3).toBe(50);
    });

    test("calculateDamage returns damage based on attacker attack if attack hits and zero otherwise, and returns a message", () => {
      const [damage1, message1] = calculateDamage(mockShipAllTen, mockShipAllFive);
      const possibleResults1 = [0, 10, 20];
      const possibleMessages = ['A hit!', 'What a hit!!!!', 'Miss!'];
      expect(possibleResults1.includes(damage1)).toBe(true);
      expect(possibleMessages.includes(message1)).toBe(true);

      const [damage2, message2] = calculateDamage(mockShipAllFive, mockShipAllTen);
      const possibleResults2 = [0, 5];
      expect(possibleResults2.includes(damage2)).toBe(true);
      expect(possibleMessages.includes(message2)).toBe(true);

      const impossibleResults = [7, 3, -1];
      expect(impossibleResults.includes(damage1)).toBe(false);
      expect(impossibleResults.includes(damage2)).toBe(false);
    });

    test('returns different message for hit, crtiical hit, and miss', () => {
      const [damage1, message1] = calculateDamage(mockShipTestCrit, mockShipAllFive);
      expect(message1).toBe('What a hit!!!!');
      expect(damage1).toBe(10);

      const [damage2, message2] = calculateDamage(mockShipTestNormalHit, mockShipAllFive);
      expect(message2).toBe('A hit!');
      expect(damage2).toBe(5);

      const [damage3, message3] = calculateDamage(mockShipTestMiss, mockShipAllFive);
      expect(message3).toBe('Miss!');
      expect(damage3).toBe(0);
    });
});