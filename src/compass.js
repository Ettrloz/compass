import p5 from 'p5';

/**
 * @param {number} initialHeading
 * @param {HTMLDivElement} element
 * @returns {{ setHeading: (heading: number) => void }}
 */
export function createCompass(initialHeading, element) {
  const { width, height } = element.getBoundingClientRect();
  let currentHeading = initialHeading;

  /**
   * @param {p5} p
   */
  function sketch(p) {
    p.setup = () => {
      p.createCanvas(width, height);
      p.angleMode(p.DEGREES);
      p.textAlign(p.CENTER, p.CENTER);
    };

    p.draw = () => {
      p.background('#111');

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.42;

      p.push();
      p.translate(cx, cy);
      p.rotate(-currentHeading);
      p.noFill();
      p.stroke(80);
      p.strokeWeight(1);
      p.circle(0, 0, radius * 2);
      p.stroke(50);
      p.line(-radius + 20, 0, radius - 20, 0);
      p.line(0, -radius + 20, 0, radius - 20);

      for (let i = 0; i < 360; i++) {
        const angle = i - 90;
        const isMajor = i % 30 === 0;
        const isMedium = i % 10 === 0;

        let tickLen = 5;

        if (isMedium) {
          tickLen = 8;
        }

        if (isMajor) {
          tickLen = 12;
        }

        const x1 = p.cos(angle) * (radius - tickLen);
        const y1 = p.sin(angle) * (radius - tickLen);
        const x2 = p.cos(angle) * radius;
        const y2 = p.sin(angle) * radius;

        if (isMajor) {
          p.stroke(255);
          p.strokeWeight(2);
        } else if (isMedium) {
          p.stroke(200);
          p.strokeWeight(1.5);
        } else {
          p.stroke(100);
          p.strokeWeight(1);
        }

        p.line(x1, y1, x2, y2);

        if (isMajor) {
          const textRadius = radius - 28;
          const tx = p.cos(angle) * textRadius;
          const ty = p.sin(angle) * textRadius;

          p.push();
          p.translate(tx, ty);
          p.rotate(i);
          p.fill(255);
          p.noStroke();

          if (i % 90 === 0) {
            const cardinal = {
              0: 'N',
              90: 'E',
              180: 'S',
              270: 'W'
            }[i];

            p.textSize(radius * 0.16);
            p.textStyle(p.BOLD);
            p.text(/** @type {string} */ (cardinal), 0, 0);
          } else {
            p.textSize(radius * 0.09);
            p.textStyle(p.NORMAL);
            p.text(i, 0, 0);
          }

          p.pop();
        }
      }

      p.pop();
      p.push();

      p.triangle(cx, cy - radius - 12, cx - 6, cy - radius - 2, cx + 6, cy - radius - 2);
      p.pop();

      p.push();
      p.translate(cx, cy);
      p.stroke(150);
      p.strokeWeight(2);
      p.line(-12, 0, 12, 0);
      p.line(0, -12, 0, 12);
      p.stroke(255);
      p.strokeWeight(1);
      p.line(-8, 0, 8, 0);
      p.line(0, -8, 0, 8);
      p.pop();
    };
  }

  new p5(sketch, element);

  return {
    /**
     * @param {number} newHeading
     */
    setHeading: newHeading => {
      currentHeading = newHeading;
    }
  };
}
