/**
 * Base module to use for creep roles
 *
 * Contains some simple functions for some actions
 **/
export const baseRole = {
	/**
	 * Finds the closest dropped energy, tombstone or destroyed structure which contain energy
	 * and moves the creep towards it / picks up the energy
	 * - Returns the target or null if no target is found
	 *
	 * @param {Creep} creep
	 * @return {*}  {(Resource<ResourceConstant> | null)}
	 **/
	findEnergy(creep: Creep): Resource<ResourceConstant> | null {
		const source = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
			filter: resource => {
				return resource.resourceType === RESOURCE_ENERGY;
			}
		});
		if (source != null) {
			if (creep.pickup(source) === ERR_NOT_IN_RANGE) {
				creep.moveTo(source);
			}
		}
		return source;
	},
	/**
	 * Finds build targets and moves creeps towards it / builds it
	 * - Returns the target, or undefined if no target is found
	 *
	 * @param {Creep} creep
	 * @return {*}  {(ConstructionSite<BuildableStructureConstant> | undefined)}
	 **/
	findAndBuildTarget(creep: Creep): ConstructionSite<BuildableStructureConstant> | undefined {
		// use find instead of findClosestByRange because this returns array sorted by when construction was queued
		const targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
		if (targets.length > 0) {
			if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0], {
					visualizePathStyle: { stroke: "#ffffff" }
				});
			}
		}
		return targets[0];
	},
	/**
	 * Finds repair targets and moves creeps towards it / repairs it
	 * - Returns the target, or undefined if no target is found
	 * - Does not target walls or ramparts
	 *
	 * @param {Creep} creep
	 * @return {*}  {(AnyStructure | undefined)}
	 **/
	findAndRepairTarget(creep: Creep): AnyStructure | undefined {
		// use find instead of findClosestByRange because this returns array which we can sort by most damaged
		// does not include walls or ramparts as they start at low hp and can be increased
		const repairTargets = creep.room.find(FIND_STRUCTURES, {
			filter: object => {
				return (
					(object.structureType === STRUCTURE_CONTAINER ||
						object.structureType === STRUCTURE_EXTENSION ||
						object.structureType === STRUCTURE_SPAWN ||
						object.structureType === STRUCTURE_ROAD) &&
					object.hits < object.hitsMax
				);
			}
		});
		if (repairTargets.length > 0) {
			repairTargets.sort((a, b) => a.hits - b.hits);
			if (creep.repair(repairTargets[0]) === ERR_NOT_IN_RANGE) {
				creep.moveTo(repairTargets[0], {
					visualizePathStyle: { stroke: "#ffffff" }
				});
			}
		}
		return repairTargets[0];
	}
};
