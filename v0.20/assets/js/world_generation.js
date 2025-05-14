let _BOXGEOMETRY = new THREE.BoxGeometry(5, 5, 5), placed_blocks = [], blocks = [
	{name: "grass", index: 0},
	{name: "cobblestone", index: 1},
	{name: "dirt", index: 2},
	{name: "oak_planks", index: 3},
	{name: "bedrock", index: 4},
	{name: "oak_trunk", index: 5},
	{name: "stone", index: 6},
	{name: "sand", index: 7},
	{name: "glass", index: 8}
];

function get_instanced_num(index) {
	let DEPTH = 0, PB = 0;

	for(let id of _WORLD_DEPTH_ID) {
		if(id == index)
			DEPTH++;
	}

	for(let pb of placed_blocks) {
		if(pb.index == index)
			PB++;
	}
	
	return CHUNK_SIZE * DEPTH * CHUNK_SIZE * CHUNKS_COUNT + PB;
}

const generation = {
	update_blocks: function() {
		for(let block of blocks) {
			if(typeof block.material == "undefined") {
				block.material = TEXTURES[block.index];

				if(block.index == 8) {
					for(let mat of block.material) {
						mat.transparent = true;
						mat.opacity = 0.9;
					}
				}
			}

			block.mesh = new THREE.InstancedMesh(_BOXGEOMETRY, block.material, get_instanced_num(block.index));
			block.count = 0;
		}
	},
	generate_chunk: function(sx, sz) {
		let x = sx * CHUNK_SIZE, z = sz * CHUNK_SIZE;
		let chunk = [];

		for(let X = x; X < CHUNK_SIZE + x; X++) {
			for(let Z = z; Z < CHUNK_SIZE + z; Z++) {
				for(let Y = 0; Y < CHUNK_HEIGHT; Y++) {
					let xoff = 0.08 * X, zoff = 0.08 * Z,
					v = Math.round(noise.perlin2(xoff, zoff) * GEN_AMPLITUDE / 5),
					_x = X * 5, _z = Z * 5, _y = (Y + v) * 5;

					if(_y <= HIGHEST_WORLD_Y)
						chunk.push(new Block(_x, _y, _z, _WORLD_DEPTH_ID[Y]));
				}
			}
		}

		chunks.push({blocks: chunk, position: {sx, sz, x, z}});
	},
	get_chunk: function(x, z) {
		for(let i in chunks) {
			let pos = chunks[i].position;

			if(pos.sx == x && pos.sz == z)
				return i;
		}
	},
	identify_chunk: function(x, z) {
		let fx = Math.floor(x / CHUNK_B_SIZE),
		fz = Math.floor(z / CHUNK_B_SIZE),
		i = this.get_chunk(fx, fz);

		if(fx < 0)
			fx = 0;

		if(fz < 0)
			fz = 0;

		return [chunks[i], parseInt(i)];
	},
	update_chunk: function(x, z) {
		let c = this.getChunk(x, z);

		if(c) {
			for(let blocks of chunks[c].blocks)
				blocks[i].display();
		}
	},
	detect_placed_blocks: function() {
		placed_blocks = [];

		for(let chunk of chunks) {
			for(let block of chunk.blocks) {
				if(block.placed)
					placed_blocks.push(block);
			}
		}
	},
	generate_world: function() {
		chunks = [];
		broken_blocks = [];
		placed_blocks = [];

		for(let x = 0; x < WORLD_SIZE; x++) {
			for(let z = 0; z < WORLD_SIZE; z++)
				this.generate_chunk(x, z);
		}
	},
	update_world: function() {
		this.detect_placed_blocks();

		for(let i in blocks) {
			scene.remove(blocks[i].mesh);

			blocks[i].mesh = new THREE.InstancedMesh(_BOXGEOMETRY, blocks[i].material, get_instanced_num(i));
			blocks[i].count = 0;

			for(let chunk of chunks) {
				for(let block of chunk.blocks) {
					if(block.index == i)
						block.display();
				}
			}

			scene.add(blocks[i].mesh);
		}
	}
};