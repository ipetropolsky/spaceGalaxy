import { SlowPlayer } from './player';
import { NoCannon } from './cannon';
import { BaseAmmo } from './ammo';
import { SilentChargedShip } from './chargedShips';
import { SlowShipFactory } from './shipFactory';

const DefaultLevel = {
    ...SlowPlayer,
    ...NoCannon,
    ...BaseAmmo,
    ...SilentChargedShip,
    ...SlowShipFactory,
};

export default DefaultLevel;
