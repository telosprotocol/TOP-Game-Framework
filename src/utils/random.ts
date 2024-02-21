export function randomAB() {
  return Math.floor(Math.random() * 10000) % 2 === 0 ? 'a' : 'b';
}
