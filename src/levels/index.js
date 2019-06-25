import { GoalApples, GoalSeconds, GoalShips } from 'src/levels/goals';
import { SlowPlayer, BasePlayer, QuickPlayer, SpeedyPlayer } from 'src/levels/player';
import { NoCannon, BaseCannon, QuickCannon, SpeedyCannon } from 'src/levels/cannon';
import {
    BaseChargedShip,
    ChargedShip,
    QuickChargedShip,
    HeavyChargedShip,
    SilentChargedShipModifier,
} from 'src/levels/chargedShips';
import {
    SlowShipFactory,
    BaseShipFactory,
    QuickShipFactory,
    QuickShipFactory2,
    SpeedyShipFactory,
} from 'src/levels/shipFactory';
import { SlowAppleFactory, BaseAppleFactory, QuickAppleFactory } from 'src/levels/appleFactory';
import { Daylight, DuskLight, Dusk } from 'src/levels/luminosity';

const DefaultLevel = {
    ...SlowPlayer,
    ...NoCannon,
    ...ChargedShip,
    ...SlowShipFactory,
    ...SlowAppleFactory,
    ...Daylight,
    skySpeed: 2,
};

export const Level1 = {
    ...DefaultLevel,
    ...BaseCannon,
    ...GoalApples(10),
};

export const Level2 = {
    ...Level1,
    ...BasePlayer,
    ...BaseCannon,
    ...BaseChargedShip,
    ...BaseShipFactory,
    ...BaseAppleFactory,
    ...GoalShips(15),
};

export const Level2Dark = {
    ...Level2,
    ...SilentChargedShipModifier(),
    ...DuskLight,
    ...GoalSeconds(60),
    skySpeed: 3,
};

export const Level3 = {
    ...Level2,
    ...QuickChargedShip,
    ...QuickShipFactory,
    ...GoalShips(15),
    skySpeed: 3,
};

export const Level3a = {
    ...Level3,
    ...QuickPlayer,
    ...QuickCannon,
    ...GoalShips(20),
};

export const Level3Dark = {
    ...Level3a,
    ...BaseChargedShip,
    ...QuickAppleFactory,
    ...DuskLight,
    ...GoalApples(15),
    skySpeed: 4,
};

export const Level4 = {
    ...Level3a,
    ...SpeedyPlayer,
    ...QuickShipFactory2,
    ...HeavyChargedShip,
    ...GoalSeconds(60),
    skySpeed: 4,
};

export const Level4a = {
    ...Level4,
    ...SpeedyCannon,
    ...SpeedyShipFactory,
    ...GoalApples(15),
};

export const Level4Dark = {
    ...Level4a,
    ...Dusk,
    ...GoalShips(15),
    skySpeed: 5,
};
