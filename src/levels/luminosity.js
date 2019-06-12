import Phaser from 'phaser';

const getLuminosity = (lightSize, gameObject, player) => {
    const distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, player.x, player.y);
    const luminosity = distance > lightSize ? 0 : 1 - distance / lightSize;
    const color = 255 * luminosity;
    return Phaser.Display.Color.GetColor(color, color, color);
};

export const Daylight = {
    luminosity: () => 0xffffff,
};

export const DuskLight = {
    luminosity: getLuminosity.bind(null, Math.pow(500, 1)),
};

export const Dusk = {
    luminosity: getLuminosity.bind(null, Math.pow(300, 1)),
};

export const Darkness = {
    luminosity: getLuminosity.bind(null, 400),
};
