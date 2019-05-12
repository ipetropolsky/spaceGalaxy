export const activate = (gameObject, x, y, vx, vy) => {
    // gameObject.setPosition(x, y);
    // gameObject.body.setVelocity(vx, vy);
    // gameObject.setActive(true);
    // gameObject.setVisible(true);
    gameObject.enableBody(true, x, y, true, true);
    gameObject.body.setVelocity(vx, vy);
};

export const deactivate = (gameObject) => {
    if (gameObject.active) {
        gameObject.disableBody(true, true);
        // gameObject.body.setVelocity(0, 0);
        // gameObject.setActive(false);
        // gameObject.setVisible(false);
    }
};

export const checkDeadMembers = (group) => {
    group.getChildren().forEach((member) => {
        if (member.active && member.outOfScreen()) {
            group.onDeactivate && group.onDeactivate(member);
            deactivate(member);
        }
    });
};

export const leadToZero = (velocity, step) => {
    return velocity + step * (velocity > 0 ? -1 : 1);
};
