import { createCompass } from './compass.js';

document.addEventListener('DOMContentLoaded', () => {
  const directionElement = /** @type {HTMLSpanElement} */ (document.getElementById('direction'));
  const headingElement = /** @type {HTMLSpanElement} */ (document.getElementById('heading'));
  const compassElement = /** @type {HTMLDivElement} */ (document.getElementById('compass'));

  const compass = createCompass(0, compassElement);

  /** @type {{ requestPermission?: () => Promise<'granted' | 'denied'> }} */
  const DeviceOrientationEventStatic = /** @type {any} */ (DeviceOrientationEvent);

  /**
   * @param {number} value
   * @return {string}
   */
  function getWindDirection(value) {
    const directions = [
      'North',
      'Northeast',
      'East',
      'Southeast',
      'South',
      'Southwest',
      'West',
      'Northwest'
    ];

    const index = Math.round(value / 45) % 8;

    return directions[index];
  }

  /**
   * @param {DeviceOrientationEvent} event
   */
  function handleOrientation(event) {
    if (event.alpha == null || event.beta == null || event.gamma == null) {
      return;
    }

    const heading = getHeading(event.alpha, event.beta, event.gamma);

    compass.setHeading(heading);

    directionElement.textContent = getWindDirection(heading);
    headingElement.textContent = Math.round(heading).toString();
  }

  /**
   * @param {number} alpha
   * @param {number} beta
   * @param {number} gamma
   * @return {number}
   */
  function getHeading(alpha, beta, gamma) {
    const a = (alpha * Math.PI) / 180;
    const b = (beta * Math.PI) / 180;
    const g = (gamma * Math.PI) / 180;

    const ca = Math.cos(a);
    const sa = Math.sin(a);

    const cb = Math.cos(b);
    const sb = Math.sin(b);

    const cg = Math.cos(g);
    const sg = Math.sin(g);

    const r11 = ca * cg - sa * sb * sg;
    const r12 = -sa * cb;
    const r13 = ca * sg + sa * sb * cg;

    const r21 = sa * cg + ca * sb * sg;
    const r22 = ca * cb;
    const r23 = sa * sg - ca * sb * cg;

    const r31 = -cb * sg;
    const r32 = sb;
    const r33 = cb * cg;

    const topX = r12;
    const topY = r22;

    const backX = -r13;
    const backY = -r23;

    const flatWeight = Math.abs(r33);

    let x = flatWeight * topX + (1 - flatWeight) * backX;
    let y = flatWeight * topY + (1 - flatWeight) * backY;

    if (Math.abs(x) < 0.000001 && Math.abs(y) < 0.000001) {
      x = r11;
      y = r21;
    }

    let heading = (Math.atan2(x, y) * 180) / Math.PI;

    heading = (heading + 360) % 360;

    const screenAngle =
      screen.orientation?.angle ??
      // @ts-ignore
      window.orientation ??
      0;

    heading = (heading + screenAngle + 360) % 360;

    return heading;
  }

  function startOrientation() {
    window.addEventListener('deviceorientation', handleOrientation);
  }

  // iOS requires explicit permission.
  if (typeof DeviceOrientationEventStatic.requestPermission === 'function') {
    DeviceOrientationEventStatic.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          startOrientation();
        }
      })
      .catch(console.error);
  } else {
    // Android / other browsers.
    startOrientation();
  }
});
