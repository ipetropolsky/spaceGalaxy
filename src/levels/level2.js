import Level1 from './level1';
import { BasePlayer } from './player';
import { BaseCannon } from './cannon';
import { BaseShip } from './ships';
import { BaseChargedShip } from './chargedShips';
import { BaseShipFactory } from './shipFactory';

const Level2 = {
    ...Level1,
    ...BasePlayer,
    ...BaseCannon,
    ...BaseShip,
    ...BaseChargedShip,
    ...BaseShipFactory,
};

export default Level2;
