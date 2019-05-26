import Level2 from './level2';
import { QuickPlayer } from './player';
import { QuickCannon } from './cannon';
import { QuickChargedShip } from './chargedShips';
import { QuickShipFactory } from './shipFactory';

const Level3 = {
    ...Level2,
    ...QuickPlayer,
    ...QuickCannon,
    ...QuickChargedShip,
    ...QuickShipFactory,
};

export default Level3;
