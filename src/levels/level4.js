import Level3 from 'src/levels/level3';
import { DiagonalShipFactory } from 'src/levels/shipFactory';
import { SilentChargedShipModifier } from 'src/levels/chargedShips';
import { Dusk } from 'src/levels/luminosity';
import { GoalSeconds, GoalApples } from 'src/levels/goals';

const Level4 = {
    ...Level3,
    ...DiagonalShipFactory,
    ...GoalSeconds(60),
    // onStart: function() {
    //     console.log('Level 4 started at ' + this.scene.time.now);
    // },
};

export default Level4;

export const Level4Dark = {
    ...Level4,
    ...SilentChargedShipModifier,
    ...Dusk,
    ...GoalApples(10),
    // onStart: function() {
    //     console.log('Level 4 Dark started at ' + this.scene.time.now);
    // },
};
