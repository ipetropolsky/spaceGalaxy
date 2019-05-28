import { GoalApples } from './goals';
import { SlowPlayer } from './player';
import { NoCannon } from './cannon';
import { BaseAmmo } from './ammo';
import { SilentChargedShip } from './chargedShips';
import { SlowShipFactory } from './shipFactory';
import { SlowAppleFactory } from './appleFactory';
import { Daylight } from './luminosity';

const DefaultLevel = {
    ...GoalApples(10),
    ...SlowPlayer,
    ...NoCannon,
    ...BaseAmmo,
    ...SilentChargedShip,
    ...SlowShipFactory,
    ...SlowAppleFactory,
    ...Daylight,
};

export default DefaultLevel;
