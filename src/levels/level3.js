import Level2 from './level2';
import { QuickPlayer } from './player';
import { QuickCannon } from './cannon';
import { QuickShip } from './ships';
import { QuickChargedShip } from './chargedShips';
import { QuickShipFactory } from './shipFactory';

const Level3 = {
    ...Level2,
    ...QuickPlayer,
    ...QuickShip,
    ...QuickCannon,
    ...QuickChargedShip,
    ...QuickShipFactory,
};

export default Level3;
