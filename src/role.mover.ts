import { baseRole } from "baseRole";

/**
 *	Picks up energy from floor, tombstones and destroyed buildings
 *	and transfers the energy to expansions, spawns and towers
 *	- only need `MOVE` and `CARRY`
 *
 */
export const roleMover = {
	/**
	 * Executes this roles' main function
	 * @param {Creep} creep
	 */
	run(creep: Creep): void {
		if (!creep.memory.working && creep.store.getUsedCapacity("energy") === 0) {
			creep.memory.working = true;
			creep.say("🖐 collect");
		}
		if (creep.memory.working && creep.store.getFreeCapacity("energy") === 0) {
			creep.memory.working = false;
			creep.say("💼 deliver");
		}
		if (creep.memory.working) {
			if (baseRole.findEnergy(creep) === null) {
				console.log(`${creep.name} has no available energy to pickup`);
			}
		} else {
			const targets = creep.room.find(FIND_STRUCTURES, {
				filter: structure => {
					return (
						(structure.structureType === STRUCTURE_EXTENSION ||
							structure.structureType === STRUCTURE_SPAWN ||
							structure.structureType === STRUCTURE_TOWER) &&
						structure.energy < structure.energyCapacity
					);
				}
			});
			// console.log("targets:   " + targets[0]);
			if (targets.length > 0) {
				if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0]);
				}
			}
		}
	}
};
