import Level2 from './level2';
import { QuickPlayer } from './player';
import { QuickCannon } from './cannon';
import { QuickChargedShip, BaseChargedShip } from './chargedShips';
import { QuickShipFactory } from './shipFactory';
import { Dusk } from './luminosity';
import { GoalShips, GoalApples } from './goals';

const Level3 = {
    ...Level2,
    ...QuickPlayer,
    ...QuickCannon,
    ...QuickChargedShip,
    ...QuickShipFactory,
    ...GoalShips(20),
    // onStart: function() {
    //     console.log('Level 3 started at ' + this.scene.time.now);
    // },
};

export default Level3;

export const Level3Dark = {
    ...Level3,
    ...BaseChargedShip,
    ...Dusk,
    ...GoalApples(15),
    // onStart: function() {
    //     console.log('Level 3 Dark started at ' + this.scene.time.now);
    // },
};
