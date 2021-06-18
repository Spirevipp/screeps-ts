/*
	Picks up energy from floor, containers and tombstones and moves to expansions and spawns
	only need MOVE and CARRY

	TODO does not work yet
*/
export const roleMover = {
	/** @param {Creep} creep **/
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
			const source = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
				filter: resource => {
					return resource.resourceType === RESOURCE_ENERGY;
				}
			});
			// console.log("source:    " + sources[0]);
			if (source != null) {
				if (creep.pickup(source) === ERR_NOT_IN_RANGE) {
					creep.moveTo(source);
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
