import Level3 from './level3';
import { DiagonalShipFactory } from './shipFactory';

const Level4 = {
    ...Level3,
    ...DiagonalShipFactory,
};

export default Level4;
