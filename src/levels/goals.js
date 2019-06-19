import { APPLES_COUNT, SHIPS_COUNT } from 'src/registry';

export const APPLES = 'APPLES';
export const SHIPS = 'SHIPS';
export const SECONDS = 'SECONDS';

export const GoalNothing = () => false;

export const GoalApples = (count) => ({
    goalType: APPLES,
    goalParam: count,
    finished() {
        return this.scene.registry.get(APPLES_COUNT) - this.startApples >= count;
    },
});

export const GoalShips = (count) => ({
    goalType: SHIPS,
    goalParam: count,
    finished() {
        return this.scene.registry.get(SHIPS_COUNT) - this.startShips >= count;
    },
});

export const GoalSeconds = (count) => ({
    goalType: SECONDS,
    goalParam: count,
    finished() {
        return this.scene.time.now - this.startTime >= count * 1000;
    },
});
