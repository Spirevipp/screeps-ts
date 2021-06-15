let _ = require("lodash");
let roleHarvester = require("role.harvesterT1");
let roleUpgrader = require("role.upgraderT1");
let roleBuilder = require("role.builderT1");
let roleRepairer = require("role.repairer");
let roleMover = require("role.mover");

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

function spawnNewCreep(role, bodyparts, tier, memory) {
	let memoryConstructor = { role: role, tier: tier };
	memoryConstructor = Object.assign(memoryConstructor, memory);
	let name = role + "_" + Game.time;
	let returnCode = Game.spawns[currentSpawn].spawnCreep(
		bodyparts,
		name,
		memoryConstructor
	);
	if (returnCode === 0) {
		console.log(`Spawning a ${tier} ${role} with name ${name}`);
	} else if (returnCode === -4) {
		console.log("Spawner is busy");
	} else if (returnCode === -6) {
		console.log("Not enough energy to spawn creep");
	}
}

module.exports.loop = function () {
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
	}

	if (harvestersT1.length < maxHarvestersT1) {
		let newName = Game.spawns["Spawn1"].createCreep(
			[WORK, CARRY, MOVE],
			undefined,
			{ role: "harvester", tier: 1 }
		);
		console.log(
			"Spawning new Tier1 harvester: " +
				newName +
				"       -4 = busy, -6 = not enough energy"
		);
	} else if (buildersT1.length < maxBuildersT1) {
		let newName = Game.spawns["Spawn1"].createCreep(
			[WORK, CARRY, MOVE],
			undefined,
			{ role: "builderT1", new: true, source: false }
		);
		console.log(
			"Spawning new Tier1 builder: " +
				newName +
				"       -4 = busy, -6 = not enough energy"
		);
	} else if (upgradersT1.length < maxUpgradersT1) {
		let newName = Game.spawns["Spawn1"].createCreep(
			[WORK, CARRY, MOVE],
			undefined,
			{ role: "upgraderT1", new: true, source: false }
		);
		console.log(
			"Spawning new Tier1 upgrader: " +
				newName +
				"       -4 = busy, -6 = not enough energy"
		);
	}

	/*
	let tower = Game.getObjectById("588bc6fca5f7732157ce3882");
	if (tower) {
		//console.log(tower);
		let closestDamagedStructure = tower.pos.findClosestByRange(
			FIND_STRUCTURES,
			{
				filter: (structure) => {
					return (
						(structure.structureType == STRUCTURE_CONTAINER ||
							structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_SPAWN ||
							structure.structureType == STRUCTURE_ROAD) &&
						structure.hits < structure.hitsMax
					);
				},
			}
		);

		if (closestDamagedStructure) {
			console.log("Tower repairing    " + closestDamagedStructure.pos);
			tower.repair(closestDamagedStructure);
		}

		let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (closestHostile) {
			tower.attack(closestHostile);
		}
	}
*/
	// Run roles
	for (let name in Game.creeps) {
		let creep = Game.creeps[name];
		if (creep.memory.role == "harvester") {
			roleHarvester.run(creep);
		}
		if (creep.memory.role == "upgrader") {
			roleUpgrader.run(creep);
		}
		if (creep.memory.role == "builder") {
			roleBuilder.run(creep);
		}
		if (creep.memory.role == "repairer") {
			roleRepairer.run(creep);
		}
		if (creep.memory.role == "mover") {
			roleMover.run(creep);
		}
	}
};
