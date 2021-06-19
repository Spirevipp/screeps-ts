import { baseRole } from "baseRole";

/**
 * Fully integrated builder for early constructing, and repairs if idle
 * - example 300 energy worker: `[WORK, CARRY, CARRY, MOVE, MOVE]`
 * - example minimal (150) energy worker: `[WORK, CARRY, MOVE]`
 */
export const roleBuilder = {
	/**
	 * Executes this roles' main function
	 * @param {Creep} creep
	 */
	run(creep: Creep): void {
		if (creep.memory.working && creep.store.getUsedCapacity("energy") === 0) {
			creep.memory.working = false;
			creep.say("🔄 harvest");
		}
		if (!creep.memory.working && creep.store.getFreeCapacity("energy") === 0) {
			creep.memory.working = true;
			creep.say("🚧 build");
		}

		if (creep.memory.working) {
			if (baseRole.findAndBuildTarget(creep) === undefined) {
				baseRole.findAndRepairTarget(creep);
			}
		} else {
			if (baseRole.findEnergy(creep) === null) {
				console.log(`${creep.name} has no available energy to pickup`);
			}
		}
	}
};
