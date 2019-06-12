import { GoalApples } from 'src/levels/goals';
import { SlowPlayer } from 'src/levels/player';
import { NoCannon } from 'src/levels/cannon';
import { BaseAmmo } from 'src/levels/ammo';
import { ChargedShip } from 'src/levels/chargedShips';
import { SlowShipFactory } from 'src/levels/shipFactory';
import { SlowAppleFactory } from 'src/levels/appleFactory';
import { Daylight } from 'src/levels/luminosity';

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
