const saving = {
	optimize_chunks: function(chnks) {
		let optimized = [], blocks;

		function c(n) {
			return n.toString(36);
		}

		chnks.forEach(chunk => {
			let blks = chunk.blocks,
			pos = chunk.position;

			blocks = "";
			
			blks.forEach(b => blocks += `${c(b.index)}|${b.placed ? "1" : "0"}|${c(b.x / 5)}|${c(b.y / 5)}|${c(b.z / 5)}_`);
			optimized.push({b: blocks, x: pos.x, z: pos.z, sx: pos.sx, sz: pos.sz});
		});

		return optimized;
	},
	convert_world: function(world) {
		let final_chunks = [];

		// Fix Crashes
		if(!world.n)
			world.n = name;

		if(!world.s)
			world.s = randomIntNumber(-65536, 65536);

		for(let chunk of world.c) {
			let final_chunk = {}, blocks = [], block = new Block(), value = "",
			j = 0, chr;

			for(let chr of chunk.b) {
				if(chr == "|" || chr == "_") {
					let val = parseInt(value, 36);

					if(j == 0)
						block.index = val;

					if(j == 1)
						block.placed = val ? true : false;

					if(j == 2)
						block.x = val * 5;

					if(j == 3)
						block.y = val * 5;

					if(j == 4)
						block.z = val * 5;

					j++;
					value = "";

					if(j > 4) {
						blocks.push(block);
						block = new Block();
						j = 0;
					}
				} else
					value += chr;
			}

			final_chunk.blocks = blocks;
			final_chunk.position = {
				x: chunk.x,
				z: chunk.z,
				sx: chunk.sx,
				sz: chunk.sz
			};

			final_chunks.push(final_chunk);
		}

		if(!world.ws) {
			let size = 0;
			final_chunks.forEach(_ => size++);

			world.ws = Math.sqrt(size);
		}

		return {
			chunks: final_chunks,
			position: {x: world.x, y: world.y, z: world.z},
			rotation: {x: world.rx, y: world.ry, z: world.rz},
			seed: world.s,
			world_size: world.ws,
			name: world.n
		};
	},
	save: function(n, c, p, r, s, ws) {
		game.saving_anim();
		f_pause.save_options();

		let world = LZString144.compressToEncodedURIComponent(JSON.stringify({
			c: this.optimize_chunks(c),
			x: parseFloat(p.x.toFixed(1)),
			y: parseFloat(p.y.toFixed(1)),
			z: parseFloat(p.z.toFixed(1)),
			rx: r.x,
			ry: r.y,
			rz: r.z,
			s,
			ws: ws,
			n
		}));

		localStorage.setItem(`world_${n}`, world);
	},
	load: function(name) {
		let world = LZString144.decompressFromEncodedURIComponent(localStorage.getItem(`world_${name}`));

		if(world)
			return this.convert_world(JSON.parse(world));

		return null;
	},
	save_to_file: function(n) {
		game.saving_anim();

		let p = vec3toList(camera.position), r = vec3toList(camera.rotation), s = game.seed,
		world = {
			c: this.optimize_chunks(chunks),
			x: parseFloat(p.x.toFixed(1)),
			y: parseFloat(p.y.toFixed(1)),
			z: parseFloat(p.z.toFixed(1)),
			rx: r.x,
			ry: r.y,
			rz: r.z,
			s,
			ws: WORLD_SIZE,
			n
		},
		elem = document.createElement("a"),
		file = LZString144.compressToEncodedURIComponent(JSON.stringify(world));

		elem.setAttribute("href", `data:text;charset=utf-8,${file}`);
		elem.setAttribute("download", `world_${n}.mcw`);
		elem.style.display = "none";
		
		document.body.appendChild(elem);
		elem.click();
		document.body.removeChild(elem);
	},
	load_from_file: function() {
		let input = document.createElement("input"), world, json;
		input.type = "file";

		input.onchange = e => {
			let reader = new FileReader();
			reader.readAsText(e.target.files[0], "UTF-8");
			reader.onload = re => {
				json = JSON.parse(LZString144.decompressFromEncodedURIComponent(re.target.result));

				if(json) {
					world = this.convert_world(json);

					console.log(world);

					clearInterval(game.save_interval_id);
					game.timer = 0;
					game.can_pause = true;
					game.can_resume = true;
					game.paused = false;
					game.last_item = 0;
					
					chunks = [];
					placed_blocks = [];

					chunks = world.chunks;
					WORLD_SIZE = world.world_size;
					fix_all_gen_vars();

					noise.seed(game.seed = world.seed);

					let pos = world.position, rot = world.rotation;

					camera.position.x = pos.x;
					camera.position.y = pos.y;
					camera.position.z = pos.z;
					camera.rotation.isEuler = true;
					camera.rotation.x = rot.x;
					camera.rotation.y = rot.y;
					camera.rotation.z = rot.z;

					scene = new THREE.Scene();
					scene.background = new THREE.Color(skyColor);
					scene.fog = new THREE.Fog(skyColor, 30, fog);

					if(options.lightsEnabled)
						scene.add(ambient_light, dir_light);

					game.save_interval_id = setInterval(game.saveWorld, 6e4);
					generation.update_world();
					f_pause.goto(0);
					game.getElement("pause_menu").style.display = "none";
				}
			};
		};

		input.click();
	}
};