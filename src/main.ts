import _ from "lodash";
import { roleBuilder } from "role.builder";
import { roleHarvesterStarter } from "role.harvesterStarter";
import { roleRepairer } from "role.repairer";
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
	// Memory variables
	interface Memory {
		// Store max creeps as memory variables for easier access in screeps website
		maxCreeps: {
			maxHarvestersStarter: number;
			maxHarvesters: number;
			maxBuilders: number;
			maxRepairers: number;
			maxUpgraders: number;
			maxMoverers: number;
		};
	}

	// Creep memory variables
	// role should always be populated with
	// most creeps use the working var aswell
	interface CreepMemory {
		role: string;
		working?: boolean;
		target?: number[];
	}

	// Syntax for adding proprties to `global` (ex "global.log")
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface Global {
			log: any;
		}
	}
}
const currentSpawn = "Spawn1"; // Blærgh

// Dette skal bli til sett av en energy source til hver harvester
const sourceList = Game.spawns[currentSpawn].room.find(FIND_SOURCES);

// Starter
Memory.maxCreeps.maxHarvestersStarter = 1; // Skal kun hente energy til spawn for raskere start
// Tierless, hver rolle må ha sine bodypart definisjoner
// Skal stå foran source og droppe energy på bakken
Memory.maxCreeps.maxHarvesters = sourceList.length;
Memory.maxCreeps.maxBuilders = 1; // Plukker opp energy og bygger, hvis tom reparere, hvis tom upgrade
// repairer kan droppes når towers e tilgjengelig, sett extra inn i builders
Memory.maxCreeps.maxRepairers = 1; // Plukker opp energy og reparer, hvis tom bygge, hvis tom upgrade
Memory.maxCreeps.maxUpgraders = 1; // Plukker opp energy og upgrade RCL
Memory.maxCreeps.maxMoverers = 1; // Plukker opp energy og flytter til structures

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

	const creepAmounts: { [key: string]: number } = {};
	for (const key in currentCreeps) {
		creepAmounts[key] = Object.keys(currentCreeps[key]).length;
	}
	logCreeps(creepAmounts);

	// TODO gjør hele denne seksjonen til en dynamisk funksjon(?) - ingen hardkodede rolle sjekk
	const harvesters = _.filter(Game.creeps, creep => creep.memory.role === "harvester");
	const builders = _.filter(Game.creeps, creep => creep.memory.role === "builder");
	const repairers = _.filter(Game.creeps, creep => creep.memory.role === "repairer");
	console.log(`Harvesters: ${harvesters.length}, builders: ${builders.length}, repairers ${repairers.length}`);
	if (harvesters.length < Memory.maxCreeps.maxHarvesters) {
		const parts = [WORK, CARRY, CARRY, MOVE, MOVE];
		spawnCreep("harvester", parts);
	} else if (builders.length < Memory.maxCreeps.maxBuilders) {
		const parts = [WORK, CARRY, CARRY, MOVE, MOVE];
		spawnCreep("builder", parts);
	} else if (repairers.length < Memory.maxCreeps.maxRepairers) {
		const parts = [WORK, CARRY, CARRY, MOVE, MOVE];
		spawnCreep("repairer", parts);
	}
	// Run each creep code
	// TODO gjør om til dynamisk iterasjon gjennom liste av currentCreeps
	for (const name in Game.creeps) {
		const creep = Game.creeps[name];
		if (creep.memory.role === "harvester") {
			roleHarvesterStarter.run(creep);
		} else if (creep.memory.role === "builder") {
			roleBuilder.run(creep);
		} else if (creep.memory.role === "repairer") {
			roleRepairer.run(creep);
		} else {
			console.log(`Invalid role for ${name}`);
		}
	}
	// Tower code TODO
	// might work
	const towerList = Game.spawns[currentSpawn].room.find(FIND_MY_STRUCTURES, {
		filter: { structureType: STRUCTURE_TOWER }
	});
	for (const tower of towerList) {
		if (tower.structureType === STRUCTURE_TOWER) {
			towers.run(tower);
		}
	}
});
/**
 * Creep spawner function
 *
 * Tries to spawn a creep at `currentSpawn`
 *
 * Logs status to console
 *
 * @param {string} role
 * @param {BodyPartConstant[]} bodyParts
 */
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
/**
 * Prints current roles and amount of creeps per role to console
 *
 * @param {{ [key: string]: number }} creepAmounts
 */
function logCreeps(creepAmounts: { [key: string]: number }) {
	let str = "";
	for (const key in creepAmounts) {
		str = `${str} ${key}: ${creepAmounts[key]}`;
	}
	console.log(str);
}
