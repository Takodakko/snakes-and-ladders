import { describe, expect, test } from 'vitest';
import { makeNewEnemy, calculateHitPercent, calculateDamage } from '../../calculations/battle-calculations';
import { IShipStats } from "../../appTypes";
import mockData from '../mocks/mockData';
const { mockShipAllFive, mockShipAllTen } = mockData;

describe('battle calculation functions', () => {
    test('makeNewEnemy creates a new enemy', () => {
      const enemy: IShipStats = makeNewEnemy();
      expect(enemy).toBeTruthy();
      expect(enemy).toHaveProperty('name');
      expect(enemy).toHaveProperty('attack');
      expect(enemy).toHaveProperty('stamina');
      expect(enemy).toHaveProperty('speed');
      expect(typeof enemy.name).toBe('string');
      expect(typeof enemy.attack).toBe('number');
      expect(typeof enemy.stamina).toBe('number');
      expect(typeof enemy.speed).toBe('number');
    });

    test("calculateHitPercents uses two ships to calculate the attacker's hit rate", () => {
      const rate1 = calculateHitPercent(mockShipAllFive, mockShipAllTen);
      expect(rate1).toBe(25);
      const rate2 = calculateHitPercent(mockShipAllTen, mockShipAllFive);
      expect(rate2).toBe(75);
      const rate3 = calculateHitPercent(mockShipAllFive, mockShipAllFive);
      expect(rate3).toBe(50);
    });

    test("calculateDamage returns damage based on attacker attack if attack hits and zero otherwise", () => {
      const damage1 = calculateDamage(mockShipAllTen, mockShipAllFive);
      const possibleResults1 = [0, 10];
      expect(possibleResults1.includes(damage1)).toBe(true);

      const damage2 = calculateDamage(mockShipAllFive, mockShipAllTen);
      const possibleResults2 = [0, 5];
      expect(possibleResults2.includes(damage2)).toBe(true);

      const impossibleResults = [7, 3, -1];
      expect(impossibleResults.includes(damage1)).toBe(false);
      expect(impossibleResults.includes(damage2)).toBe(false);
    });
});