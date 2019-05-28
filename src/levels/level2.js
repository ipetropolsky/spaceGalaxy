import Level1 from './level1';
import { BasePlayer } from './player';
import { BaseCannon } from './cannon';
import { BaseChargedShip, SilentChargedShip } from './chargedShips';
import { BaseShipFactory } from './shipFactory';
import { BaseAppleFactory } from './appleFactory';
import { Dusk } from './luminosity';
import { GoalShips, GoalSeconds } from './goals';

const Level2 = {
    ...Level1,
    ...BasePlayer,
    ...BaseCannon,
    ...BaseChargedShip,
    ...BaseShipFactory,
    ...BaseAppleFactory,
    ...GoalShips(20),
    onStart: function() {
        console.log('Level 2 started at ' + this.scene.time.now);
    },
};

export default Level2;

export const Level2Dark = {
    ...Level2,
    ...SilentChargedShip,
    ...Dusk,
    ...GoalSeconds(60),
};
