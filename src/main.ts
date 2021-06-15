import _ from "lodash";
import { roleBuilderRC1 } from "role.builderRC1";
import { roleHarvesterRC1 } from "role.harvesterRC1";
// eslint-disable-next-line sort-imports
import { ErrorMapper } from "utils/ErrorMapper";

declare global {
	/*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
	// Memory extension samples
	interface Memory {
		maxCreeps: {
			maxHarvestersRC1: number;
			maxBuildersRC1: number;
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
Memory.maxCreeps.maxHarvestersRC1 = 4;

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

	const harvestersRC1 = _.filter(Game.creeps, creep => creep.memory.role === "harvesterRC1");
	const buildersRC1 = _.filter(Game.creeps, creep => creep.memory.role === "builderRC1");
	if (harvestersRC1.length < Memory.maxCreeps.maxHarvestersRC1) {
		const err = Game.spawns.Spawn1.spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], `harvesterRC1_${Game.time}`, {
			memory: {
				role: "harvesterRC1",
				working: false
			}
		});
		console.log(`Tried to spawn harvester: ${err}`);
	} else if (buildersRC1.length < Memory.maxCreeps.maxBuildersRC1) {
		const err = Game.spawns.Spawn1.spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], `builderRC1_${Game.time}`, {
			memory: {
				role: "builderRC1",
				working: false
			}
		});
		console.log(`Tried to spawn builder: ${err}`);
	}
	// Run each creep code
	// added extra role check for compatability
	for (const name in Game.creeps) {
		const creep = Game.creeps[name];
		if (
			creep.memory.role === "harvesterRC1" ||
			creep.memory.role === "harvesterT1" ||
			creep.memory.role === "upgraderT1"
		) {
			roleHarvesterRC1.run(creep);
		} else if (creep.memory.role === "builderRC1" || creep.memory.role === "builderT1") {
			roleBuilderRC1.run(creep);
		} else {
			console.log(`Invalid role for ${name}`);
		}
	}
});
