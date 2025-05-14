const player = {
	w: .8, // Width
	h: 8, // Height
	d: .6, // Depth
	pos: new THREE.Vector3(40, 100, 40),
	move_speed: 20,
	speed: new THREE.Vector3(0, 0, 0),
	vec: new THREE.Vector3(),
	jump_enabled: true,
	jump_speed: -.7,
	falling_time: 0,
	last_pos: new THREE.Vector3(40, 100, 40),
	selectedItem: 1,
	col: false,
	stop: function() {
		this.pos = new THREE.Vector3(40, 100, 40);
		this.speed = new THREE.Vector3(0, 0, 0);
		this.vec = new THREE.Vector3();
		this.last_pos = new THREE.Vector3(40, 100, 40);
		this.jump_enabled = true;
		this.selectedItem = 1;
		this.falling_time = 0;
	},
	move_forward: function(dis) {
		this.vec.setFromMatrixColumn(camera.matrix, 0);
		this.vec.crossVectors(camera.up, this.vec);
		camera.position.addScaledVector(this.vec, dis);
	},
	move_right: function(dis) {
		this.vec.setFromMatrixColumn(camera.matrix, 0);
		camera.position.addScaledVector(this.vec, dis);
	},
	update: function() {
		this.move_player();
	},
	reposition: function() {
		if(camera.position.x > WORLD_BORDER)
			camera.position.x = WORLD_BORDER;

		if(camera.position.x < 0)
			camera.position.x = 0;

		if(camera.position.z > WORLD_BORDER)
			camera.position.z = WORLD_BORDER;

		if(camera.position.z < 0)
			camera.position.z = 0;
	},
	check_controls: function() {
		if(keys.get("w") || touching.get("f"))
			this.move(0, 1);

		if(keys.get("s") || touching.get("b"))
			this.move(0, -1);

		if(keys.get("a") || touching.get("l"))
			this.move(-1, 0);

		if(keys.get("d") || touching.get("r"))
			this.move(1, 0);

		if(keys.get(" ") || touching.get("j"))
			this.jump();

		if(keys.get("1"))
			this.selectedItem = 2;
		else if(keys.get("2"))
			this.selectedItem = 1;
		else if(keys.get("3"))
			this.selectedItem = 3;
		else if(keys.get("4"))
			this.selectedItem = 5;
		else if(keys.get("5"))
			this.selectedItem = 6;
		else if(keys.get("6"))
			this.selectedItem = 7;
		else if(keys.get("7"))
			this.selectedItem = 8;
	},
	move: function(x, z) {
		if(x != 0)
			this.move_right(this.move_speed * x * gameCtx.dt);

		if(z != 0)
			this.move_forward(this.move_speed * z * gameCtx.dt);
	},
	jump: function() {
		if(this.jump_enabled && this.falling_time < 5)
			this.speed.y = this.jump_speed, this.jump_enabled = false;
	},
	move_player: function() {
		camera.position.sub(this.speed);
		this.speed.y += 2.9 * gameCtx.dt;

		if(this.speed.y > 0)
			this.falling_time += 100 * gameCtx.dt;

		if(this.speed.y > 11)
			this.speed.y = 11;

		if(this.speed.y < -11)
			this.speed.y = -11;

		if(this.pos.y < MIN_WORLD_Y - 100)
			this.kill();

		this.reposition();

		this.pos.copy(camera.position);

		this.collision();
		this.last_pos.copy(camera.position);
	},
	collision: function() {
		for(let chunk of chunks) {
			for(let b of chunk.blocks) {
				this.col = intersect(b.x, b.y + 10, b.z, 5, 5, 5, this.pos.x, this.pos.y, this.pos.z, this.w - .2, 1, this.d - .2);
				if(this.col && this.pos.y < b.y + 2.5 + this.h && this.pos.y > b.y) {
					camera.position.y = b.y + 2.5 + this.h;
					this.speed.y = 0;
					this.falling_time = 0;
					this.jump_enabled = true;
				}

				this.col = intersect(b.x, b.y, b.z, 5, 5, 5, this.pos.x, this.pos.y, this.pos.z, this.w - .2, 1, this.d - .2);
				if(this.col && this.pos.y < b.y && this.pos.y > b.y - 2.5 - this.h) {
					camera.position.y = b.y - 3.5;
					this.speed.y = 0;
					this.falling_time = 99;
					this.jump_enabled = false;
				}

				if(b.y - 2.5 < this.pos.y + this.h && b.y + 2.5 > this.pos.y - this.h) {
					this.col = intersect(b.x - 1, b.y + 3, b.z, 5, 5, 5, this.pos.x, this.pos.y, this.pos.z, this.w + 1, this.h, this.d);
					if(this.col && this.pos.x > b.x - 2.5 - this.w)
						camera.position.x = this.last_pos.x;

					this.col = intersect(b.x + 1, b.y + 3, b.z, 5, 5, 5, this.pos.x, this.pos.y, this.pos.z, this.w + 1, this.h, this.d);
					if(this.col && this.pos.x < b.x + 2.5 + this.w)
						camera.position.x = this.last_pos.x;

					this.col = intersect(b.x, b.y + 3, b.z - 1, 5, 5, 5, this.pos.x, this.pos.y, this.pos.z, this.w, this.h, this.d + 1);
					if(this.col && this.pos.z > b.z - 2.5 - this.d)
						camera.position.z = this.last_pos.z;

					this.col = intersect(b.x, b.y + 3, b.z + 1, 5, 5, 5, this.pos.x, this.pos.y, this.pos.z, this.w, this.h, this.d + 1);
					if(this.col && this.pos.z < b.z + 2.5 + this.d)
						camera.position.z = this.last_pos.z;
				}
			}
		}
	},
	kill: function() {
		camera.position.x = camera.position.z = 40;
		camera.position.y = 100;
		this.speed.y = 0;

		this.last_pos.copy(camera.position);

		camera.rotation.x = -2.073512360129646;
		camera.rotation.y = -0.56715683523921;
		camera.rotation.z = -2.367783058088994;
	}
};