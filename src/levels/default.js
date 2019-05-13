export default class DefaultLevel {
    name = 'default';

    shipCanFire = false;
    shipMinSpeed = 100;
    shipMaxSpeed = 300;
    shipThrowsAmmo = false;
    shipWithAmmoRatio = 0;
    shipWithAmmoCanFire = false;
    shipWithAmmoInitialBullets = 0;
    shipShotDelay = 1000;
    shipFactoryDelayMin = 750;
    shipFactoryDelayMax = 1500;

    bulletSpeed = 400;
    shipBulletSpeed = 400;

    playerCanFire = false;
    playerInitialBullets = 10;
    bulletsInAmmo = 2;
}
