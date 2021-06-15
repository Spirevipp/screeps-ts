export const towers = {
	run(tower: StructureTower): void {
		const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter(structure) {
				return structure.hits < structure.hitsMax;
			}
		});

		if (closestDamagedStructure) {
			// console.log(`Tower repairing: ${closestDamagedStructure.pos}`);
			tower.repair(closestDamagedStructure);
		}

		const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (closestHostile) {
			tower.attack(closestHostile);
		}
	}
};
