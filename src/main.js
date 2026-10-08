import { createCompass } from './compass.js';

document.addEventListener('DOMContentLoaded', () => {
  const directionElement = /** @type {HTMLSpanElement} */ (document.getElementById('direction'));
  const headingElement = /** @type {HTMLSpanElement} */ (document.getElementById('heading'));
  const compassElement = /** @type {HTMLDivElement} */ (document.getElementById('compass'));

  /** @type {{ requestPermission?: () => Promise<'granted' | 'denied'> }} */
  const DeviceOrientationEventStatic = /** @type {any} */ (DeviceOrientationEvent);

  // For iOS
  if (typeof DeviceOrientationEventStatic.requestPermission === 'function') {
    DeviceOrientationEventStatic.requestPermission()
      .then((/** @type {string} */ permissionState) => {
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      })
      .catch(console.error);
  } else {
    // Non iOS browser
    window.addEventListener('deviceorientation', handleOrientation);
  }

  const compass = createCompass(0, compassElement);

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

    const x = ca * sg + sa * sb * cg;

    const y = sa * sg - ca * sb * cg;

    let heading = (Math.atan2(-x, -y) * 180) / Math.PI;

    return (heading + 360) % 360;
  }
});
