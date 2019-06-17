export const ChargedShip = {
    shipCanFire: true,
    chargedShipInitialBullets: 2,
    shipShotDelay: 10000,
    shipBulletVelocity: 200,
    shipBulletAcceleration: 200,
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

export const SuperChargedShipModifier = ({ chargedShipInitialBullets, shipShotDelay }) => ({
    chargedShipInitialBullets: chargedShipInitialBullets * 3,
    shipShotDelay: Math.round(shipShotDelay * 0.33),
});

export const SuperChargedShipCannonModifier = ({ shipBulletVelocity }) => ({
    shipBulletVelocity: Math.round(shipBulletVelocity * 1.75),
});

export const SilentChargedShipModifier = () => ({
    shipCanFire: false,
});
