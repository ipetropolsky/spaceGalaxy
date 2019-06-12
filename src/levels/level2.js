import Level1 from 'src/levels/level1';
import { BasePlayer } from 'src/levels/player';
import { BaseCannon } from 'src/levels/cannon';
import { BaseChargedShip, SilentChargedShipModifier } from 'src/levels/chargedShips';
import { BaseShipFactory } from 'src/levels/shipFactory';
import { BaseAppleFactory } from 'src/levels/appleFactory';
import { Dusk } from 'src/levels/luminosity';
import { GoalShips, GoalSeconds } from 'src/levels/goals';

const Level2 = {
    ...Level1,
    ...BasePlayer,
    ...BaseCannon,
    ...BaseChargedShip,
    ...BaseShipFactory,
    ...BaseAppleFactory,
    ...GoalShips(15),
    // onStart: function() {
    //     console.log('Level 2 started at ' + this.scene.time.now);
    // },
};

export default Level2;

export const Level2Dark = {
    ...Level2,
    ...SilentChargedShipModifier,
    ...Dusk,
    ...GoalSeconds(60),
    // onStart: function() {
    //     console.log('Level 2 Dark started at ' + this.scene.time.now);
    // },
};
