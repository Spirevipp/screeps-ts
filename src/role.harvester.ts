/**
 * Only harvester, this should drop energy on containers (or floor) for other workers
 * - does not need a `CARRY` part - cant use a `CARRY` part, will break
 * - only 1 `MOVE` part needed to get to energy source
 * - more `WORK` parts = faster energy collection
 */
export const roleHarvester = {
	/**
	 * Executes this roles' main function
	 * @param {Creep} creep
	 **/
	run(creep: Creep): void {
		const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
		if (source !== null && creep.harvest(source) === ERR_NOT_IN_RANGE) {
			creep.moveTo(source, {
				visualizePathStyle: { stroke: "#ffaa00" }
			});
		}
	}
};
