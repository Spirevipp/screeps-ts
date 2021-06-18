/*
	Only harvester, this should drop energy on containers (or floor) for other workers
	does not need a carry part - cant use a CARRY part, will break
	only 1 MOVE part needed to get to energy source
	more WORK parts = faster energy collection

*/
export const roleHarvesterRC2 = {
	/** @param {Creep} creep **/
	run(creep: Creep): void {
		const sources = creep.room.find(FIND_SOURCES_ACTIVE);
		if (creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[1], {
				visualizePathStyle: { stroke: "#ffaa00" }
			});
		}
	}
};
