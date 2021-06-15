export const roleHarvesterRC1 = {
  /** @param {Creep} creep **/
  run(creep: Creep): void {
    if (!creep.memory.working && creep.store.getFreeCapacity("energy") >= 0) {
      creep.memory.working = true;
      creep.say("🔄 harvest");
    }
    if (creep.memory.working && creep.store.getFreeCapacity("energy") === 0) {
      creep.memory.working = false;
      creep.say("💼 delivery");
    }

    if (creep.memory.working) {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {
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
