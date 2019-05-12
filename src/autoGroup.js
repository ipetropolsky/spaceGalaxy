import Phaser from 'phaser';

import { DEFAULT } from './layers';
import { checkDeadMembers } from './utils';

export class SimpleAutoGroup extends Phaser.Physics.Arcade.Group {
    classType = Phaser.Physics.Arcade.Image;
    depth = DEFAULT;

    constructor(world, scene) {
        super(world, scene);
        this.setDepth(this.depth);
        scene.add.existing(this);
    }
}

export default class AutoGroup extends SimpleAutoGroup {
    preUpdate() {
        checkDeadMembers(this);
    }
}
