export const NoCannon = {
    playerCanFire: false,
    playerInitialBullets: 0,
    bulletVelocity: 0,
    bulletAcceleration: 0,
};

export const BaseCannon = {
    playerCanFire: true,
    playerInitialBullets: 10,
    bulletVelocity: 400,
    bulletAcceleration: 200,
};

export const QuickCannon = {
    playerCanFire: true,
    playerInitialBullets: 15,
    bulletVelocity: 600,
    bulletAcceleration: 225,
};

export const SpeedyCannon = {
    playerCanFire: true,
    playerInitialBullets: 20,
    bulletVelocity: 800,
    bulletAcceleration: 250,
};

export const SuperCannonModifier = ({ bulletVelocity }) => ({
    bulletVelocity: Math.round(bulletVelocity * 1.75),
});
