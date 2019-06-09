import { GoalApples } from './goals';
import { SlowPlayer } from './player';
import { NoCannon } from './cannon';
import { BaseAmmo } from './ammo';
import { ChargedShip } from './chargedShips';
import { SlowShipFactory } from './shipFactory';
import { SlowAppleFactory } from './appleFactory';
import { Daylight } from './luminosity';

const DefaultLevel = {
    ...GoalApples(10),
    ...SlowPlayer,
    ...NoCannon,
    ...BaseAmmo,
    ...ChargedShip,
    ...SlowShipFactory,
    ...SlowAppleFactory,
    ...Daylight,
};

export default DefaultLevel;
