import { APPLES_COUNT, SHIPS_COUNT, GOAL_APPLES, GOAL_SHIPS, GOAL_SECONDS } from 'src/registry';

export const GoalNothing = () => false;

export const GoalApples = (count) => ({
    goalType: GOAL_APPLES,
    goalParam: count,
    finished() {
        return this.scene.registry.get(APPLES_COUNT) - this.startApples >= count;
    },
});

export const GoalShips = (count) => ({
    goalType: GOAL_SHIPS,
    goalParam: count,
    finished() {
        return this.scene.registry.get(SHIPS_COUNT) - this.startShips >= count;
    },
});

export const GoalSeconds = (count) => ({
    goalType: GOAL_SECONDS,
    goalParam: count,
    finished() {
        const elapsedTime = this.scene.time.now - (this.scene.pausedTime || 0) - this.startTime;
        const secondsLeft = count * 1000 - elapsedTime;
        this.scene.registry.set(GOAL_SECONDS, (secondsLeft / 1000).toFixed(1));
        return secondsLeft <= 0;
    },
});
