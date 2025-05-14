const TEXTURE_FLAG = "assets/images/", loader = new THREE.TextureLoader(), block_textures = [
	"blocks/grass_s",
	"blocks/cobblestone",
	"blocks/grass_b",
	"blocks/oak_planks",
	"blocks/bedrock",
	"blocks/oak_trunk_s",
	"blocks/stone",
	"blocks/sand",
	"blocks/glass"
];

let TEXTURES = [];

const load_textures = () => {
	TEXTURES = [];
	
	[
		[
			"blocks/grass_s",
			"blocks/grass_s",
			"blocks/grass_t",
			"blocks/grass_b",
			"blocks/grass_s",
			"blocks/grass_s"
		],
		"blocks/cobblestone",
		"blocks/grass_b",
		"blocks/oak_planks",
		"blocks/bedrock",
		[
			"blocks/oak_trunk_s",
			"blocks/oak_trunk_s",
			"blocks/oak_trunk_tb",
			"blocks/oak_trunk_tb",
			"blocks/oak_trunk_s",
			"blocks/oak_trunk_s"
		],
		"blocks/stone",
		"blocks/sand",
		"blocks/glass"
	].forEach(texs => {
		if(typeof texs == "object") {
			let texture = [];

			for(let tex of texs) {
				let map = {map: loader.load(`${TEXTURE_FLAG}${tex}.png`)};

				if(options.lightsEnabled)
					texture.push(new THREE.MeshLambertMaterial(map));
				else
					texture.push(new THREE.MeshBasicMaterial(map));
			}

			TEXTURES.push(texture);
		}

		if(typeof texs == "string") {
			let tex,
			map = {map: loader.load(`${TEXTURE_FLAG}${texs}.png`)};

			if(options.lightsEnabled)
				tex = new THREE.MeshLambertMaterial(map);
			else
				tex = new THREE.MeshBasicMaterial(map);

			TEXTURES.push([tex, tex, tex, tex, tex, tex]);
		}
	});

	generation.update_blocks();
}