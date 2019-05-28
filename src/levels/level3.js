import Level2 from './level2';
import { QuickPlayer } from './player';
import { QuickCannon } from './cannon';
import { QuickChargedShip, SilentChargedShip } from './chargedShips';
import { QuickShipFactory } from './shipFactory';
import { Dusk } from './luminosity';
import { GoalShips, GoalApples } from './goals';

const Level3 = {
    ...Level2,
    ...QuickPlayer,
    ...QuickCannon,
    ...QuickChargedShip,
    ...QuickShipFactory,
    ...GoalApples(20),
};

export default Level3;

export const Level3Dark = {
    ...Level3,
    ...SilentChargedShip,
    ...Dusk,
    ...GoalShips(15),
};
