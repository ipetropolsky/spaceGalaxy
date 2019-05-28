import DefaultLevel from './default';
import { Dusk } from './luminosity';
import { GoalSeconds, GoalApples } from './goals';

const Level1 = {
    ...DefaultLevel,
    ...GoalApples(10),
};

export default Level1;

export const Level1Dark = {
    ...Level1,
    ...GoalApples(15),
    ...Dusk,
};
