export const SlowAppleFactory = {
    appleFactoryDelayMin: 3000,
    appleFactoryDelayMax: 4000,
    appleMinSpeed: 100,
    appleMaxSpeed: 200,
};

export const BaseAppleFactory = {
    appleFactoryDelayMin: 2500,
    appleFactoryDelayMax: 3500,
    appleMinSpeed: 150,
    appleMaxSpeed: 250,
};

export const QuickAppleFactory = {
    appleFactoryDelayMin: 2000,
    appleFactoryDelayMax: 3000,
    appleMinSpeed: 200,
    appleMaxSpeed: 300,
};

export const SuperAppleFactoryModifier = ({
    appleFactoryDelayMin,
    appleFactoryDelayMax,
    appleMinSpeed,
    appleMaxSpeed,
}) => ({
    appleFactoryDelayMin: Math.round(appleFactoryDelayMin * 0.5),
    appleFactoryDelayMax: Math.round(appleFactoryDelayMax * 0.5),
    appleMinSpeed: Math.round(appleMinSpeed * 1.5),
    appleMaxSpeed: Math.round(appleMaxSpeed * 1.5),
});
