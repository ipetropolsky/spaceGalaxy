import { SlowPlayer } from './player';
import { NoCannon } from './cannon';
import { BaseAmmo } from './ammo';
import { SlowShip } from './ships';
import { SilentChargedShip } from './chargedShips';
import { SlowShipFactory } from './shipFactory';

const DefaultLevel = {
    ...SlowPlayer,
    ...NoCannon,
    ...BaseAmmo,
    ...SlowShip,
    ...SilentChargedShip,
    ...SlowShipFactory,
};

export default DefaultLevel;
