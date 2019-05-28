import Level3 from './level3';
import { DiagonalShipFactory } from './shipFactory';
import { SilentChargedShip } from './chargedShips';
import { Dusk } from './luminosity';
import { GoalSeconds, GoalApples } from './goals';

const Level4 = {
    ...Level3,
    ...DiagonalShipFactory,
    ...GoalSeconds(30),
};

export default Level4;

export const Level4Dark = {
    ...Level4,
    ...SilentChargedShip,
    ...Dusk,
    ...GoalApples(10),
};
