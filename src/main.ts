import _ from "lodash";
import { roleBuilderRC1 } from "role.builderRC1";
import { roleHarvesterRC1 } from "role.harvesterRC1";
import { roleRepairerRC1 } from "role.repairerRC1";
import { towers } from "towers";
// eslint-disable-next-line sort-imports
import { ErrorMapper } from "utils/ErrorMapper";

declare global {
	/*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them.
          (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context.
    This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged.
    This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
	// Memory extension samples
	interface Memory {
		maxCreeps: {
			maxHarvestersRC1: number;
			maxBuildersRC1: number;
			maxRepairersRC1: number;
		};
	}

	interface CreepMemory {
		role: string;
		working?: boolean;
	}

	// Syntax for adding proprties to `global` (ex "global.log")
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface Global {
			log: any;
		}
	}
}

Memory.maxCreeps.maxBuildersRC1 = 2;
Memory.maxCreeps.maxHarvestersRC1 = 5;
Memory.maxCreeps.maxRepairersRC1 = 1;

const currentSpawn = "Spawn1";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
	console.log(`Current game tick is ${Game.time}`);

	// Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			console.log(`Deleting unused memory for ${name}`);
			delete Memory.creeps[name];
		}
	}

	const currentCreeps: { [key: string]: { [key: string]: Creep } } = _.reduce(
		Game.creeps,
		function (result: { [key: string]: { [key: string]: Creep } }, creep, key: string) {
			const role = creep.memory.role;
			result[role] = { [key]: creep };
			return result;
		},
		{}
	);
	console.log(Object.keys(currentCreeps).toString());
	/* console.log(
		_.mapValues(currentCreeps, function (name: Record<string, unknown>, role: string) {
			return `${role}: ${Object.keys(name).length}`;
		})
	); */

	const harvestersRC1 = _.filter(Game.creeps, creep => creep.memory.role === "harvesterRC1");
	const buildersRC1 = _.filter(Game.creeps, creep => creep.memory.role === "builderRC1");
	const repairersRC1 = _.filter(Game.creeps, creep => creep.memory.role === "repairerRC1");
	console.log(`Harvesters: ${harvestersRC1.length}, builders: ${buildersRC1.length}, repairers ${repairersRC1.length}`);
	if (harvestersRC1.length < Memory.maxCreeps.maxHarvestersRC1) {
		const parts = [WORK, CARRY, CARRY, MOVE, MOVE];
		spawnCreep("harvesterRC1", parts);
	} else if (buildersRC1.length < Memory.maxCreeps.maxBuildersRC1) {
		const parts = [WORK, CARRY, CARRY, MOVE, MOVE];
		spawnCreep("builderRC1", parts);
	} else if (repairersRC1.length < Memory.maxCreeps.maxRepairersRC1) {
		const parts = [WORK, CARRY, CARRY, MOVE, MOVE];
		spawnCreep("repairerRC1", parts);
	}
	// Run each creep code
	for (const name in Game.creeps) {
		const creep = Game.creeps[name];
		if (creep.memory.role === "harvesterRC1") {
			roleHarvesterRC1.run(creep);
		} else if (creep.memory.role === "builderRC1") {
			roleBuilderRC1.run(creep);
		} else if (creep.memory.role === "repairerRC1") {
			roleRepairerRC1.run(creep);
		} else {
			console.log(`Invalid role for ${name}`);
		}
	}
	// Tower code TODO
	// might work
	const towerList = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
		filter: { structureType: STRUCTURE_TOWER }
	});
	for (const tower of towerList) {
		if (tower.structureType === STRUCTURE_TOWER) {
			towers.run(tower);
		}
	}
});

function spawnCreep(role: string, bodyParts: BodyPartConstant[]) {
	const out = Game.spawns[currentSpawn].spawnCreep(bodyParts, `${role}_${Game.time}`, {
		memory: {
			role,
			working: false
		}
	});
	switch (out) {
		case 0:
			console.log(`Spawning a ${role}`);
			break;
		case -4:
			console.log(`Tried to spawn a ${role}, but spawner is busy`);
			break;
		case -6:
			console.log(`Tried to spawn a ${role}, but we do not have enough energy`);
			break;

		default:
			break;
	}
}
