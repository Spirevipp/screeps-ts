/*
	Picks up energy from floor, containers and tombstones and moves to expansions and spawns
	only need MOVE and CARRY
*/
export const roleMoverRC2 = {
	/** @param {Creep} creep **/
	run(creep: Creep): void {
		if (!creep.memory.working && creep.carry.energy === 0) {
			creep.memory.working = true;
			creep.say("Collecting");
		}
		if (creep.memory.working && creep.carry.energy >= creep.carryCapacity / 2) {
			creep.memory.working = false;
			creep.say("LUL");
		}
		if (creep.memory.working) {
			const sources = creep.room.find(FIND_STRUCTURES, {
				filter: structure => {
					return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0;
				}
			});
			// console.log("source:    " + sources[0]);
			if (sources.length > 0) {
				if (creep.withdraw(sources[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0]);
				}
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
