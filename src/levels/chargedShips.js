export const ChargedShip = {
    shipCanFire: false,
    chargedShipInitialBullets: 2,
    shipShotDelay: 0,
    shipBulletVelocity: 0,
    shipBulletAcceleration: 0,
};

export const BaseChargedShip = {
    shipCanFire: true,
    chargedShipInitialBullets: 2,
    shipShotDelay: 5000,
    shipBulletVelocity: 300,
    shipBulletAcceleration: 200,
};

export const QuickChargedShip = {
    shipCanFire: true,
    chargedShipInitialBullets: 3,
    shipShotDelay: 2000,
    shipBulletVelocity: 400,
    shipBulletAcceleration: 200,
};

export const HeavyChargedShip = {
    shipCanFire: true,
    chargedShipInitialBullets: 4,
    shipShotDelay: 1000,
    shipBulletVelocity: 500,
    shipBulletAcceleration: 200,
};

export const SilentChargedShipModifier = {
    shipCanFire: false,
};
