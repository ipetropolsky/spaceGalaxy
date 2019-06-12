import DefaultLevel from 'src/levels/default';
import { Dusk } from 'src/levels/luminosity';
import { GoalApples } from 'src/levels/goals';
import { BaseCannon } from 'src/levels/cannon';

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
