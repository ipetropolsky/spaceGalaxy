import Level3 from './level3';
import { DiagonalShipFactory } from './shipFactory';
import { SilentChargedShipModifier } from './chargedShips';
import { Dusk } from './luminosity';
import { GoalSeconds, GoalApples } from './goals';

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
