export const activate = (gameObject, x, y, vx, vy) => {
    gameObject.enableBody(true, x, y, true, true);
    gameObject.body.setVelocity(vx, vy);
};

export const deactivate = (gameObject) => {
    if (gameObject.active) {
        gameObject.disableBody(true, true);
    }
};

const WORLD_PADDING = 100;
export const outOfScreen = (gameObject) => {
    if (gameObject.outOfScreen) {
        return gameObject.outOfScreen();
    }
    return (
        gameObject.y + gameObject.displayHeight / 2 < -WORLD_PADDING ||
        gameObject.y - gameObject.displayHeight / 2 > gameObject.scene.game.config.height + WORLD_PADDING
    );
};

export const checkDeadMembers = (group) => {
    group.getChildren().forEach((member) => {
        if (member.active && outOfScreen(member)) {
            group.onDeactivate && group.onDeactivate(member);
            deactivate(member);
        }
    });
};

export const leadToZero = (velocity, step) => {
    return velocity + step * (velocity > 0 ? -1 : 1);
};
