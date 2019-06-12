import Level2 from 'src/levels/level2';
import { QuickPlayer } from 'src/levels/player';
import { QuickCannon } from 'src/levels/cannon';
import { QuickChargedShip, BaseChargedShip } from 'src/levels/chargedShips';
import { QuickShipFactory } from 'src/levels/shipFactory';
import { Dusk } from 'src/levels/luminosity';
import { GoalShips, GoalApples } from 'src/levels/goals';

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
