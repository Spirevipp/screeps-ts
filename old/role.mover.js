var roleMover = {
	run: function (creep) {
		if (!creep.memory.collecting && creep.carry.energy == 0) {
			creep.memory.collecting = true;
			creep.say("Collecting");
		}
		if (
			creep.memory.collecting &&
			creep.carry.energy >= creep.carryCapacity / 2
		) {
			creep.memory.collecting = false;
			creep.say("LUL");
		}
		if (creep.memory.collecting) {
			var sources = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (
						structure.structureType == STRUCTURE_CONTAINER &&
						structure.store[RESOURCE_ENERGY] > 0
					);
				},
			});
			//console.log("source:    " + sources[0]);
			if (sources.length > 0) {
				if (
					creep.withdraw(sources[0], RESOURCE_ENERGY) ==
					ERR_NOT_IN_RANGE
				) {
					creep.moveTo(sources[0]);
				}
			}
		} else {
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (
						(structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_SPAWN ||
							structure.structureType == STRUCTURE_TOWER) &&
						structure.energy < structure.energyCapacity
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

module.exports = roleMover;
