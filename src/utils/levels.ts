import { Level } from '../types/game';

// Helper function to check if a number is prime
const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

export const levels: Level[] = [
  {
    id: 1,
    name: "Even Indices",
    description: "Squares at even positions flash",
    rule: (index: number) => index % 2 === 0
  },
  {
    id: 2,
    name: "Diagonals", 
    description: "Main and anti-diagonal squares flash",
    rule: (index: number, row: number, col: number) => row === col || row + col === 4
  },
  {
    id: 3,
    name: "Prime Numbers",
    description: "Squares at prime indices flash",
    rule: (index: number) => isPrime(index)
  },
  {
    id: 4,
    name: "Center Cluster",
    description: "Center square and its neighbors flash",
    rule: (index: number) => [6, 7, 8, 11, 12, 13, 16, 17, 18].includes(index)
  },
  {
    id: 5,
    name: "Modulo Magic",
    description: "Squares where (row + col) % 3 = 0 flash",
    rule: (index: number, row: number, col: number) => (row + col) % 3 === 0
  }
];