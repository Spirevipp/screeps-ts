var roleRepairer = {
    run: function(creep) {
	    if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('TriHard');
	    }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repairing = true;
	        creep.say('FeelsBadMan');
	    }
        if(creep.memory.repairing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (object) => {
                    return (object.structureType == STRUCTURE_CONTAINER ||
                            object.structureType == STRUCTURE_EXTENSION ||
                            object.structureType == STRUCTURE_SPAWN ||
                            object.structureType == STRUCTURE_ROAD ||
                            object.structureType == STRUCTURE_RAMPART ||
                            object.structureType == STRUCTURE_WALL) && object.hits < object.hitsMax;
                }
            });
            targets.sort((a,b) => a.hits - b.hits);
            //console.log(creep.name + "'s targets:   " + targets[0]);
            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);    
                }
            }
            
            
            else {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length > 0) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
            }
        } else {
	        var sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0;
                        }
            });
            if(sources.length > 0) {
                if(creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
	    }
    }
};
module.exports = roleRepairer;