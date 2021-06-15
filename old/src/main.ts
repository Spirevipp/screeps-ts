import _ from "lodash";
import { roleHarvester } from "./role.harvesterT1";
import { roleUpgrader } from "./role.upgraderT1";
import { roleBuilder } from "./role.builderT1";
// import { roleRepairer } from "./role.repairer";
// import { roleMover } from "./role.mover";

declare global {
	interface Memory {
		uuid: number;
		log: any;
		logTimer: number;
	}

	interface CreepMemory {
		role: string;
		tier: number;
		building?: boolean;
		upgrading?: boolean;
	}

	// Syntax for adding proprties to `global` (ex "global.log")
	namespace NodeJS {
		interface Global {
			log: any;
		}
	}
}

let harvesterQuantity = { T1: 1, T2: 0, T3: 0 };
let builderQuantity = { T1: 1, T2: 0, T3: 0 };
let upgraderQuantity = { T1: 1, T2: 0, T3: 0 };
let repairerQuantity = { T1: 1, T2: 0, T3: 0 };
let moverQuantity = { T1: 1, T2: 0, T3: 0 };

let currentSpawn = "Spawn1";

function logCreeps() {
	let harvesters = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "harvester"
	);
	console.log("Harvesters: " + harvesters.length);
	let upgraders = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "upgrader"
	);
	console.log("Upgraders: " + upgraders.length);
	let builders = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "builder"
	);
	console.log("Builders: " + builders.length);
	let repairers = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "repairer"
	);
	console.log("Repairers: " + repairers.length);
}

function spawnNewCreep(
	role: string,
	bodyparts: BodyPartConstant[],
	tier: number,
	memory: object
) {
	let name = role + "_" + Game.time;
	let returnCode = Game.spawns[currentSpawn].spawnCreep(bodyparts, name, {
		memory: {
			role: role,
			tier: tier,
		},
	});
	if (returnCode === 0) {
		console.log(`Spawning a ${tier} ${role} with name ${name}`);
	} else if (returnCode === -4) {
		console.log("Spawner is busy");
	} else if (returnCode === -6) {
		console.log("Not enough energy to spawn creep");
	}
}

export const loop = () => {
	for (let name in Memory.creeps) {
		if (!Game.creeps[name]) {
			console.log(Memory.creeps.length);
			delete Memory.creeps[name];
			console.log("Clearing non-existing creep memory:", name);
		}
	}
	//quantity log
	if (Memory.logTimer === 10) {
		logCreeps();
		Memory.logTimer = 0;
	} else {
		Memory.logTimer += 1;
	}

	//Spawn new creeps
	/*
	for (let tier in harvesterQuantity) {
		if (
			tier === "T1" &&
			harvesterQuantity[tier] > 0 &&
			harvesters["T1"] < harvesterQuantity[tier]
		) {
		} else if (
			tier === "T2" &&
			harvesterQuantity[tier] > 0 &&
			harvesters["T2"] < harvesterQuantity[tier]
		) {
		} else if (
			tier === "T3" &&
			harvesterQuantity[tier] > 0 &&
			harvesters["T3"] < harvesterQuantity[tier]
		) {
		}
	}*/

	// Run roles
	for (let name in Game.creeps) {
		let creep = Game.creeps[name];
		if (creep.memory.role === "harvester") {
			roleHarvester.run(creep);
		}
		if (creep.memory.role === "upgrader") {
			roleUpgrader.run(creep);
		}
		if (creep.memory.role === "builder") {
			roleBuilder.run(creep);
		} /*
		if (creep.memory.role === "repairer") {
			roleRepairer.run(creep);
		}
		if (creep.memory.role === "mover") {
			roleMover.run(creep);
		}*/
	}
};
