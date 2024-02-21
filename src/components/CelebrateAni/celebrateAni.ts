import { RafTimer } from '@/utils/canvas/rafUtils';
import { IPoint, Vector2 } from '@/utils/canvas/Vector2';

const dt = 0.1; //

const g = new Vector2(0, 9.8 * 1.5); //
const xs = 360; //
const ys = 40; //
const textLeft = 0; //
const textTop = 40; //
const rightBorder = 360;
const bottomBorder = 280;
const gap = 8;
const MAX_BALL_COUNT = 30;

//
export class Ball {
  pos: Vector2;
  id: number;
  color: string;
  r: number;
  oR: number;
  velocity: Vector2 | null;
  life: boolean;
  constructor(x: number, y: number, r: number, id: number, oR: number) {
    this.pos = new Vector2(x, y); //
    this.id = id;
    this.color = '';
    this.r = r;
    this.velocity = null;
    this.life = true;
    this.oR = oR; //
  }

  //
  update() {
    //
    this.velocity = this.velocity.add(g.multiply(dt));
    //
    this.pos = this.pos.add(this.velocity.multiply(dt));
    //
    if (this.pos.y > bottomBorder) {
      this.life = false;
    }
  }

  paint(context: CanvasRenderingContext2D, frameIdx: number) {
    if (!this.life) return;
    context.beginPath();
    context.fillStyle = this.color;
    context.save();
    context.translate(this.pos.x, this.pos.y);

    this.oR += (Math.random() * (3 * frameIdx)) / 100; //100    30

    context.rotate((this.oR * Math.PI) / 180);
    context.rect(0, 0, (this.r * 3) / 5, this.r);
    context.fill();
    context.restore();
    // context.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, false);
  }
}

let lastRAFNum: number;
export function startDraw(
  context: CanvasRenderingContext2D,
  onEnd: () => void
) {
  const colorPalette = [
    '#FEE83C',
    '#FF3C02',
    '#68FF3A',
    '#F64DFF',
    '#33ADFF',
    '#FE7F02',
  ];

  let balls: Ball[] = [];
  const timer = new RafTimer();
  // const imgData = []; //
  // const checkPercent = 0.4; //

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
  let isBallAll = false;

  //
  function paintBg() {
    context.clearRect(0, 0, rightBorder, bottomBorder);

    // context.beginPath();
    // context.fillStyle = 'black';
    // context.save();
    // context.translate(100, 100);

    // context.rotate((45 * Math.PI) / 180);
    // context.rect(0, 0, 6, 12);
    // context.fill();
    // context.restore();

    // context.globalAlpha = 1 - (1 / 100) * timer.frame;
  }

  //
  function init() {
    // //
    // context.font = '80px bold impact';
    // //
    // context.fillStyle = 'black';
    // //
    // context.textAlign = 'left';
    // //
    // context.textBaseline = 'top';
  }
  //
  function startAnim() {
    paintBg();
    // console.log('[Celebrate] frame', timer.frame, balls.length);
    //
    // paintBg();
    //
    timer.update();
    //       ，
    if (balls.length > MAX_BALL_COUNT) {
      isBallAll = true;
    }
    //
    balls = balls.map((ball) => {
      ball.update();
      ball.paint(context, timer.frame); //
      return ball;
    });
    handleTimerChange();
    // context.globalAlpha -= 1 / (60 * 5);
    //

    if (isBallAll && balls.length == 0) {
      if (onEnd) {
        onEnd();
      }
      return;
    }
    lastRAFNum = requestAnimationFrame(startAnim);
  }

  //
  function handleTimerChange() {
    let position;
    //
    balls = balls.filter((ball) => ball.life);
    //
    for (let y = 0; y < ys / gap; y++) {
      const maxGap = xs / gap;
      // const mid = maxGap / 2;
      for (let x = 0; x < maxGap / 4; x++) {
        [-1, 1].forEach((dir) => {
          position = shouldAddBall(dir === -1 ? x : maxGap - x, y, x / maxGap);
          if (position) {
            // console.log(
            //   '[Celebrate] addBall',
            //   timer.frame,
            //   balls.length,
            //   position.x
            // );
            addBall(position, dir < 0);
          }
        });
      }
    }
  }

  //
  function shouldAddBall(x: number, y: number, _xPercent: number) {
    const posX = textLeft + x * gap;
    const posY = textTop + y * gap;
    if (balls.length > MAX_BALL_COUNT || isBallAll) {
      return;
    } else {
      const randomNum = Math.floor(Math.random() * 1000);
      // const absPercent = xPercent > 0.5 ? 1 - xPercent : xPercent;
      if (randomNum % 2 === 0) {
        return;
      }
    }
    // const pixels = context.getImageData(posX, posY, 5, 5);
    // if (isBallCountLager(pixels)) {
    //   return;
    // }
    return {
      x: posX,
      y: posY,
    } as IPoint;
  }

  //
  function addBall(pos: IPoint, isLeft: boolean) {
    const { x, y } = pos;
    const r = Math.ceil(Math.random() * 5 + 8);
    // const h = Math.ceil(Math.random() * 10 + 5);
    const colorIdx =
      Math.ceil(Math.random() * colorPalette.length * 100) %
      colorPalette.length;
    const left = isLeft ? 1 : -1;
    const oR = 180 * Math.random();
    const ball = new Ball(x, y, r, balls.length, oR);
    ball.color = colorPalette[colorIdx];
    ball.velocity = new Vector2(left * 30 * Math.random(), -30 * Math.random());
    balls.push(ball);
  }
}
