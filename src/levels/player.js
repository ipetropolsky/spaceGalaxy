export const SlowPlayer = {
    playerVelocityMax: 250,
    playerVelocityStepUp: 8,
    playerVelocityStepDown: 4,
};

export const BasePlayer = {
    playerVelocityMax: 300,
    playerVelocityStepUp: 12,
    playerVelocityStepDown: 6,
};

export const QuickPlayer = {
    playerVelocityMax: 350,
    playerVelocityStepUp: 16,
    playerVelocityStepDown: 8,
};

export const SpeedyPlayer = {
    playerVelocityMax: 450,
    playerVelocityStepUp: 30,
    playerVelocityStepDown: 15,
};

export const SuperPlayerModifier = ({ playerVelocityMax, playerVelocityStepUp, playerVelocityStepDown }) => ({
    playerVelocityMax: Math.round(playerVelocityMax * 1.33),
    playerVelocityStepUp: Math.round(playerVelocityStepUp * 1.33),
    playerVelocityStepDown: Math.round(playerVelocityStepDown * 1.33),
});
