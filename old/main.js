var _ = require("lodash");
var roleHarvester = require("role.harvesterT1");
var roleUpgrader = require("role.upgraderT1");
var roleBuilder = require("role.builderT1");
var roleRepairer = require("role.repairer");
var roleMover = require("role.mover");

//tier1
var enableT1 = true;
var maxHarvestersT1 = 1;
var maxUpgradersT1 = 0;
var maxBuildersT1 = 0;
var maxRepairersT1 = 0;
var maxMoversT1 = 0;

//tier2
var enableT2 = false;
var maxHarvestersT2 = 0;
var maxUpgradersT2 = 0;
var maxBuildersT2 = 0;
var maxRepairersT2 = 0;
var maxMoversT2 = 0;
//tier3
var enableT3 = false;
var maxHarvestersT3 = 0;
var maxUpgradersT3 = 0;
var maxBuildersT3 = 0;
var maxRepairersT3 = 0;
var maxMoversT3 = 0;

module.exports.loop = function () {
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			console.log(Memory.creeps.length);
			delete Memory.creeps[name];
			console.log("Clearing non-existing creep memory:", name);
		}
	}
	//quantity check
	/*
	if (Memory.logTimer === 10) {
		logCreeps();
		Memory.logTimer = 0;
	} else {
		Memory.logTimer += 1;
	}
*/
	//tier1
	var harvestersT1 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "harvesterT1"
	);
	//console.log('Tier1 Harvesters: ' + harvestersT1.length);
	var upgradersT1 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "upgraderT1"
	);
	//console.log('Tier1 Upgraders: ' + upgradersT1.length);
	var buildersT1 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "builderT1"
	);
	//console.log('Tier1 Builders: ' + buildersT1.length);
	var repairersT1 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "repairerT1"
	);
	//console.log('Tier1 Repairers: ' + repairersT1.length);
	var moversT1 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "moverT1"
	);
	//console.log('Tier1 Movers: ' + moversT1.length);

	//tier2
	var harvestersT2 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "harvesterT2"
	);
	//console.log('Tier2 Harvesters: ' + harvestersT2.length);
	var upgradersT2 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "upgraderT2"
	);
	//console.log('Tier2 Upgraders: ' + upgradersT2.length);
	var buildersT2 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "builderT2"
	);
	//console.log('Tier2 Builders: ' + buildersT2.length);
	var repairersT2 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "repairerT2"
	);
	//console.log('Tier2 Repairers: ' + repairersT2.length);
	var moversT2 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "moverT2"
	);
	//console.log('Tier2 Movers: ' + moversT2.length);

	//tier3
	var harvestersT3 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "harvesterT3"
	);
	//console.log('Tier3 Harvesters: ' + harvestersT3.length);
	var upgradersT3 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "upgraderT3"
	);
	//console.log('Tier3 Upgraders: ' + upgradersT3.length);
	var buildersT3 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "builderT3"
	);
	//console.log('Tier3 Builders: ' + buildersT3.length);
	var repairersT3 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "repairerT3"
	);
	//console.log('Tier3 Repairers: ' + repairersT3.length);
	var moversT3 = _.filter(
		Game.creeps,
		(creep) => creep.memory.role == "moverT3"
	);
	//console.log('Tier3 Movers: ' + moversT3.length);

	//Spawn new creeps
	//tier1
	if (enableT1) {
		if (harvestersT1.length < maxHarvestersT1) {
			var newName = Game.spawns["Spawn1"].createCreep(
				[WORK, CARRY, MOVE],
				undefined,
				{ role: "harvesterT1", new: true, source: false }
			);
			console.log(
				"Spawning new Tier1 harvester: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		} else if (moversT1.length < maxMoversT1) {
			var newName = Game.spawns["Spawn1"].createCreep(
				[CARRY, MOVE],
				undefined,
				{ role: "moverT1", new: true, source: false }
			);
			console.log(
				"Spawning new Tier1 mover: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		} else if (buildersT1.length < maxBuildersT1) {
			var newName = Game.spawns["Spawn1"].createCreep(
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
			var newName = Game.spawns["Spawn1"].createCreep(
				[WORK, CARRY, MOVE],
				undefined,
				{ role: "upgraderT1", new: true, source: false }
			);
			console.log(
				"Spawning new Tier1 upgrader: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		} else if (repairersT1.length < maxRepairersT1) {
			var newName = Game.spawns["Spawn1"].createCreep(
				[WORK, CARRY, MOVE],
				undefined,
				{ role: "repairerT1", new: true, source: false }
			);
			console.log(
				"Spawning new Tier1 repairer: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		}
	}

	//tier2
	if (enableT2) {
		if (harvestersT2.length < maxHarvestersT2) {
			var newName = Game.spawns["Spawn1"].createCreep(
				[WORK, WORK, CARRY, MOVE],
				undefined,
				{ role: "harvesterT2", new: true, source: false }
			);
			console.log(
				"Spawning new Tier2 harvester: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		} else if (moversT2.length < maxMoversT2) {
			var newName = Game.spawns["Spawn1"].createCreep(
				[CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
				undefined,
				{ role: "moverT2", new: true, source: false }
			);
			console.log(
				"Spawning new Tier2 mover: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		} else if (buildersT2.length < maxBuildersT2) {
			var newName = Game.spawns["Spawn1"].createCreep(
				[WORK, WORK, CARRY, MOVE],
				undefined,
				{ role: "builderT2", new: true, source: false }
			);
			console.log(
				"Spawning new Tier2 builder: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		} else if (upgradersT2.length < maxUpgradersT2) {
			var newName = Game.spawns["Spawn1"].createCreep(
				[WORK, WORK, CARRY, MOVE],
				undefined,
				{ role: "upgraderT2", new: true, source: false }
			);
			console.log(
				"Spawning new Tier2 upgrader: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		} else if (repairersT2.length < maxRepairersT2) {
			var newName = Game.spawns["Spawn1"].createCreep(
				[WORK, WORK, CARRY, MOVE],
				undefined,
				{ role: "repairerT2", new: true, source: false }
			);
			console.log(
				"Spawning new Tier2 repairer: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		}
	}

	//tier3
	if (enableT3) {
		if (harvestersT3.length < maxHarvestersT3) {
			var newName = Game.spawns["Spawn1"].createCreep(
				[WORK, WORK, WORK, CARRY, MOVE],
				undefined,
				{ role: "harvesterT3", new: true, source: false }
			);
			console.log(
				"Spawning new Tier3 harvester: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		} else if (moversT3.length < maxMoversT3) {
			var newName = Game.spawns["Spawn1"].createCreep(
				[CARRY, CARRY, MOVE, MOVE, MOVE],
				undefined,
				{ role: "moverT3", new: true, source: false }
			);
			console.log(
				"Spawning new Tier3 mover: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		} else if (buildersT3.length < maxBuildersT3) {
			var newName = Game.spawns["Spawn1"].createCreep(
				[WORK, WORK, CARRY, CARRY, MOVE, MOVE],
				undefined,
				{ role: "builderT3", new: true, source: false }
			);
			console.log(
				"Spawning new Tier3 builder: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		} else if (upgradersT3.length < maxUpgradersT3) {
			var newName = Game.spawns["Spawn1"].createCreep(
				[WORK, WORK, CARRY, CARRY, MOVE, MOVE],
				undefined,
				{ role: "upgraderT3", new: true, source: false }
			);
			console.log(
				"Spawning new Tier3 upgrader: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		} else if (repairersT3.length < maxRepairersT3) {
			var newName = Game.spawns["Spawn1"].createCreep(
				[WORK, WORK, CARRY, CARRY, MOVE, MOVE],
				undefined,
				{ role: "repairerT3", new: true, source: false }
			);
			console.log(
				"Spawning new Tier3 repairer: " +
					newName +
					"       -4 = busy, -6 = not enough energy"
			);
		}
	}

	var tower = Game.getObjectById("588bc6fca5f7732157ce3882");
	if (tower) {
		//console.log(tower);
		var closestDamagedStructure = tower.pos.findClosestByRange(
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

		var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (closestHostile) {
			tower.attack(closestHostile);
		}
	}

	for (var name in Game.creeps) {
		var creep = Game.creeps[name];
		if (
			creep.memory.role == "harvesterT1" ||
			creep.memory.role == "harvesterT2" ||
			creep.memory.role == "harvesterT3"
		) {
			roleHarvester.run(creep);
		}
		if (
			creep.memory.role == "upgraderT1" ||
			creep.memory.role == "upgraderT2" ||
			creep.memory.role == "upgraderT3"
		) {
			roleUpgrader.run(creep);
		}
		if (
			creep.memory.role == "builderT1" ||
			creep.memory.role == "builderT2" ||
			creep.memory.role == "builderT3"
		) {
			roleBuilder.run(creep);
		}
		if (
			creep.memory.role == "repairerT1" ||
			creep.memory.role == "repairerT2" ||
			creep.memory.role == "repairerT3"
		) {
			roleRepairer.run(creep);
		}
		if (
			creep.memory.role == "moverT1" ||
			creep.memory.role == "moverT2" ||
			creep.memory.role == "moverT3"
		) {
			roleMover.run(creep);
		}
	}
};
