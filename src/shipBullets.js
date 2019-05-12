import BulletGroup, { Bullet } from './bullets';

class ShipBullet extends Bullet {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setRotation(Math.PI);
    }

    outOfScreen() {
        return this.y - this.displayHeight / 2 > this.scene.game.config.height;
    }

    preUpdate(time, delta) {
        this.y += this.speed * delta;
    }
}

export default class ShipBulletGroup extends BulletGroup {
    classType = ShipBullet;
}
