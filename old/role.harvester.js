var roleHarvester = {
	run: function (creep) {
		if (!creep.memory.harvesting && creep.carry.energy == 0) {
			creep.memory.harvesting = true;
			creep.say("Harvesting");
		}
		if (
			creep.memory.harvesting &&
			creep.carry.energy == creep.carryCapacity
		) {
			creep.memory.harvesting = false;
			creep.say("Delivering");
		}

		if (creep.memory.harvesting) {
			var sources = creep.room.find(FIND_SOURCES);
			if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0]);
			}
			//console.log("source:    " + sources[0]);
		} else {
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (
						structure.structureType == STRUCTURE_SPAWN &&
						structure.store[RESOURCE_ENERGY] <
							structure.storeCapacity
					);
				},
			});
			//console.log("targets:   " + targets[0]);
			if (targets.length > 0) {
				if (
					creep.transfer(targets[0], RESOURCE_ENERGY) ==
					ERR_NOT_IN_RANGE
				) {
					creep.moveTo(targets[0]);
				}
			}
		}
	},
};

module.exports = roleHarvester;
