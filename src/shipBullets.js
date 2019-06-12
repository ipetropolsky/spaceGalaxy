import BulletGroup, { Bullet } from 'src/bullets';
import LevelManager from 'src/levelManager';
import { activate } from 'src/utils';

class ShipBullet extends Bullet {
    fire(x, y, vx, vy) {
        const level = LevelManager.getLevel();
        activate(this, x, y, vx, vy + (this.up ? -1 : 1) * level.shipBulletVelocity);
        this.setAcceleration(0, (this.up ? -1 : 1) * level.shipBulletAcceleration);
        this.setRotation(Math.PI);
        this.setDamping(true);
    }
}

export default class ShipBulletGroup extends BulletGroup {
    classType = ShipBullet;
}
