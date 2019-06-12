import { GoalApples } from 'src/levels/goals';
import { SlowPlayer } from 'src/levels/player';
import { NoCannon } from 'src/levels/cannon';
import { ChargedShip } from 'src/levels/chargedShips';
import { SlowShipFactory } from 'src/levels/shipFactory';
import { SlowAppleFactory } from 'src/levels/appleFactory';
import { Daylight } from 'src/levels/luminosity';

const DefaultLevel = {
    skySpeed: 1,
    ...GoalApples(10),
    ...SlowPlayer,
    ...NoCannon,
    ...ChargedShip,
    ...SlowShipFactory,
    ...SlowAppleFactory,
    ...Daylight,
};

export default DefaultLevel;
