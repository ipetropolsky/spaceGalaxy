import DefaultLevel from './default';
import { Dusk } from './luminosity';
import { GoalApples } from './goals';
import { BaseCannon } from './cannon';

const Level1 = {
    ...DefaultLevel,
    ...BaseCannon,
    ...GoalApples(10),
    // onStart: function() {
    //     console.log('Level 1 started at ' + this.scene.time.now);
    // },
};

export default Level1;

export const Level1Dark = {
    ...Level1,
    ...GoalApples(15),
    ...Dusk,
    // onStart: function() {
    //     console.log('Level 1 Dark started at ' + this.scene.time.now);
    // },
};
