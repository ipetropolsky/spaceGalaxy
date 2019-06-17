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
import { SlowShipFactory, BaseShipFactory, QuickShipFactory, SpeedyShipFactory } from 'src/levels/shipFactory';
import { SlowAppleFactory, BaseAppleFactory, QuickAppleFactory } from 'src/levels/appleFactory';
import { Daylight, DuskLight, Dusk } from 'src/levels/luminosity';

const DefaultLevel = {
    skySpeed: 2,
    ...SlowPlayer,
    ...NoCannon,
    ...ChargedShip,
    ...SlowShipFactory,
    ...SlowAppleFactory,
    ...Daylight,
};

export const Level1 = {
    ...DefaultLevel,
    ...GoalApples(10),
};

export const Level2 = {
    skySpeed: 2,
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
};

export const Level3 = {
    skySpeed: 3,
    ...Level2,
    ...QuickPlayer,
    ...QuickCannon,
    ...QuickChargedShip,
    ...QuickShipFactory,
    ...QuickAppleFactory,
    ...GoalShips(20),
};

export const Level3Dark = {
    ...Level3,
    ...BaseChargedShip,
    ...DuskLight,
    ...GoalApples(15),
};

export const Level4 = {
    skySpeed: 4,
    ...Level3,
    ...SpeedyPlayer,
    ...SpeedyCannon,
    ...SpeedyShipFactory,
    ...HeavyChargedShip,
    ...GoalSeconds(60),
};

export const Level4Dark = {
    ...Level4,
    ...Dusk,
    ...GoalApples(10),
};
