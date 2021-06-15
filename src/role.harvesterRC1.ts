/*
	Fully integrated harvester for energy for spawn and controller
	example 300 energy worker: [WORK, CARRY, CARRY, MOVE, MOVE]
	example minimal (150) energy worker: [WORK, CARRY, MOVE]
*/
export const roleHarvesterRC1 = {
	/** @param {Creep} creep **/
	run(creep: Creep): void {
		if (!creep.memory.working && creep.store.getUsedCapacity("energy") === 0) {
			creep.memory.working = true;
			creep.say("🔄 harvest");
		}
		if (creep.memory.working && creep.store.getFreeCapacity("energy") === 0) {
			creep.memory.working = false;
			creep.say("💼 deliver");
		}

		if (creep.memory.working) {
			const sources = creep.room.find(FIND_SOURCES_ACTIVE);
			if (creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[1], {
					visualizePathStyle: { stroke: "#ffaa00" }
				});
			}
		} else {
			const controller = creep.room.controller;
			const targets = creep.room.find(FIND_STRUCTURES, {
				filter: structure => {
					return (
						(structure.structureType === STRUCTURE_EXTENSION ||
							structure.structureType === STRUCTURE_SPAWN ||
							structure.structureType === STRUCTURE_TOWER) &&
						structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
					);
				}
			});
			if (targets.length > 0) {
				if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {
						visualizePathStyle: { stroke: "#ffffff" }
					});
				}
			} else if (controller !== undefined) {
				if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
					creep.moveTo(controller, {
						visualizePathStyle: { stroke: "#ffffff" }
					});
				}
			}
		}
	}
};
