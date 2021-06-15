export const roleRepairerRC1 = {
	/** @param {Creep} creep **/
	run(creep: Creep): void {
		if (creep.memory.working && creep.store.getUsedCapacity("energy") === 0) {
			creep.memory.working = false;
			creep.say("🔄 harvest");
		}
		if (!creep.memory.working && creep.store.getFreeCapacity("energy") === 0) {
			creep.memory.working = true;
			creep.say("🔨 repair");
		}
		if (creep.memory.working) {
			const repairTargets = creep.room.find(FIND_STRUCTURES, {
				filter: object => {
					return (
						(object.structureType === STRUCTURE_CONTAINER ||
							object.structureType === STRUCTURE_EXTENSION ||
							object.structureType === STRUCTURE_SPAWN ||
							object.structureType === STRUCTURE_ROAD ||
							object.structureType === STRUCTURE_RAMPART ||
							object.structureType === STRUCTURE_WALL) &&
						object.hits < object.hitsMax
					);
				}
			});
			repairTargets.sort((a, b) => a.hits - b.hits);
			// console.log(creep.name + "'s targets:   " + targets[0]);
			if (repairTargets.length > 0) {
				if (creep.repair(repairTargets[0]) === ERR_NOT_IN_RANGE) {
					creep.moveTo(repairTargets[0], {
						visualizePathStyle: { stroke: "#ffffff" }
					});
				}
			} else {
				const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				if (targets.length > 0) {
					if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], {
							visualizePathStyle: { stroke: "#ffffff" }
						});
					}
				}
			}
		} else {
			const sources = creep.room.find(FIND_SOURCES_ACTIVE);
			if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], {
					visualizePathStyle: { stroke: "#ffaa00" }
				});
			}
		}
	}
};
