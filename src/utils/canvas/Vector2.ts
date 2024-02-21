export interface IPoint {
  x: number;
  y: number;
}

//
export class Vector2 implements IPoint {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  copy() {
    return new Vector2(this.x, this.y);
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  sqrLength() {
    return this.x * this.x + this.y * this.y;
  }
  normalize() {
    const inv = 1 / this.length();
    return new Vector2(this.x * inv, this.y * inv);
  }
  negate() {
    return new Vector2(-this.x, -this.y);
  }
  add(v: Vector2) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
  subtract(v: Vector2) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }
  multiply(f: number) {
    return new Vector2(this.x * f, this.y * f);
  }
  divide(f: number) {
    const invf = 1 / f;
    return new Vector2(this.x * invf, this.y * invf);
  }
  dot(v: Vector2) {
    return this.x * v.x + this.y * v.y;
  }
}
