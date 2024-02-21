import { RafTimer } from '@/utils/canvas/rafUtils';
import { Vector2 } from '@/utils/canvas/Vector2';
function randomNum(min: number, max: number) {
  return Math.random() * max + min;
}
const zoom = 12;
const speedRange = [1 * zoom, 1.5 * zoom];
const sizeRange = [10, 20];
const speedScaleDown = 0.5; //px
class Ball {
  pos: Vector2;
  id: number;
  moveVec: Vector2;
  r: number;
  initialR: number;
  initialOpacity: number;
  /**
   * move angle
   */
  angle: number;

  rotateAngle: number;
  constructor(x: number, y: number, id: number) {
    this.initialOpacity = randomNum(0.7, 1);
    this.pos = new Vector2(x, y);
    this.id = id;
    this.r = randomNum(sizeRange[0], sizeRange[1]);
    this.initialR = this.r;
    this.angle = Math.random() * (Math.PI * 2);
    this.moveVec = new Vector2(
      randomNum(speedRange[0], speedRange[1]) * Math.cos(this.angle),
      randomNum(speedRange[0], speedRange[1]) * Math.sin(this.angle)
    );
    this.moveMutltiply = 1;

    this.rotateAngle = Math.random() * (Math.PI * 2);
  }
  moveMutltiply = 1;
  /**
   * update move
   */
  move() {
    this.pos = this.pos.add(this.moveVec.multiply(0.7));
    if (this.r < sizeRange[1] * 1.5) {
      this.r += speedScaleDown * 0.8;
    }
    this.moveMutltiply *= 0.95;
    if (this.moveMutltiply > 0.5) {
      this.moveVec = this.moveVec.multiply(0.95);
    }
    // const dir = this.moveVec.x > 0 ? 1 : -1;
    // this.rotateAngle =
    //   (this.rotateAngle + dir * Math.random() * 0.02 * this.rotateAngle) %
    //   (Math.PI * 2);
  }
}

// canvas size
let lastRAFNum: number;
export async function startDraw(
  context: CanvasRenderingContext2D,
  onEnd: () => void,
  options: {
    size: { width: number; height: number };
  }
) {
  const { size } = options;
  const img = new Image();
  img.src = require('./img/coin.png');
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  let balls: Ball[] = [];
  const timer = new RafTimer();
  start();
  function start() {
    if (lastRAFNum != null) {
      cancelAnimationFrame(lastRAFNum);
    }
    init();
    context.globalAlpha = 1;
    paintBg();
    lastRAFNum = requestAnimationFrame(startAnim);
  }
  function paintBg() {
    context.clearRect(0, 0, size.width, size.height);
  }

  function init() {
    const count = Math.floor(Math.random() * 2 + 10);
    for (let i = 0; i < count; i++) {
      const ball = new Ball(
        size.width / 2 + randomNum(-10, 10),
        size.height / 2,
        i + randomNum(-10, 10)
      );
      balls.push(ball);
    }
  }
  //
  function startAnim() {
    paintBg();
    //update timer
    timer.update();

    //draw
    balls = balls.filter((ball) => {
      const sizeZoom = ball.r / ball.initialR;
      context.globalAlpha = sizeZoom * ball.initialOpacity;
      context.save();
      // if (sizeZoom < 0.5) {
      //   context.globalAlpha = sizeZoom * 0.3;
      // } else {
      //   context.globalAlpha = 1;
      // }
      context.translate(ball.pos.x, ball.pos.y);
      context.rotate(ball.rotateAngle);
      context.drawImage(img, 0, 0, ball.r, ball.r);
      context.restore();
      // context.rotate(0);
      ball.move();
      if (
        ball.pos.x > size.width + sizeRange[1] ||
        ball.pos.x < 0 - sizeRange[1]
      ) {
        return false;
      }
      // if (ball.r > sizeRange[1] * 2) {
      //   return false;
      // }
      return true;
    });
    context.globalAlpha = 1;

    if (balls.length == 0) {
      if (onEnd) {
        onEnd();
      }
      return;
    }
    lastRAFNum = requestAnimationFrame(startAnim);
  }
}
