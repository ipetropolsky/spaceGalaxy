export const activate = (gameObject, x, y, vx, vy) => {
    gameObject.enableBody(true, x, y, true, true);
    gameObject.body.setVelocity(vx, vy);
};

export const deactivate = (gameObject) => {
    if (gameObject.active) {
        gameObject.disableBody(true, true);
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
