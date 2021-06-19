/**
 * Main code for towers, currently very simple
 * - Only attacks and repairs for closest target
 **/
export const towers = {
	/**
	 * Executes this roles' main function
	 * @param {StructureTower} tower
	 **/
	run(tower: StructureTower): void {
		const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter(structure) {
				return structure.hits < structure.hitsMax;
			}
		});

		if (closestDamagedStructure != null) {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			console.log(
				`Tower repairing: ${closestDamagedStructure.structureType} ${closestDamagedStructure.pos.x}, ${closestDamagedStructure.pos.y}`
			);
			tower.repair(closestDamagedStructure);
		}

		const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (closestHostile) {
			tower.attack(closestHostile);
		}
	}
};
