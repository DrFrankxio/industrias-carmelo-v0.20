const game = {
	timer: 0,
	music_timer: 0,
	can_pause: true,
	paused: false,
	last_item: 0,
	GAME_STARTED: false,
	seed: randomIntNumber(-65536, 65536),
	world_name: "one",
	save_interval_id: null,
	doing_saving_anim: false,
	can_resume: true,
	pause_scene: 0,
	playing_music: false,
	music_name: "",
	existent_worlds: [],
	world_names: ["one", "two", "three", "four", "five"],
	save_world: function() {
		saving.save(game.world_name, chunks, vec3toList(camera.position), vec3toList(camera.rotation), game.seed, WORLD_SIZE);
	},
	start: function() {
		Sound.loadplay_sound("click.ogg");

		if(mobile.activated)
			game.getElement("mobile_controls").style.display = "block";
		
		document.addEventListener("touchstart", mobile.touch_start);
		document.addEventListener("touchmove", mobile.touch_move);
		document.addEventListener("touchend", mobile.touch_end);
		scene = new THREE.Scene();
		scene.background = new THREE.Color(skyColor);
		scene.fog = new THREE.Fog(skyColor, 30, fog);

		if(options.lightsEnabled)
			scene.add(ambient_light, dir_light);

		this.GAME_STARTED = true;
		this.set_world();
		this.pause_scene = 0;

		this.save_interval_id = setInterval(this.saveWorld, 6e4);

		generation.update_world();
		game_ui_section.style.display = "block";

		this.getElement("world_creation_menu").style.display = "none";
		document.body.appendChild(renderer.domElement);
		
		timer.start();
	},
	pause: function(save = true) {
		if(!this.paused && this.can_pause) {
			if(this.playing_music)
				Sound.pause_sound(this.music_name);

			this.can_resume = true;
			this.paused = true;

			pause_section.style.display = "block";

			if(this.paused)
				controls.unlock();
			else
				controls.lock();

			this.can_pause = false;
		}

		if(this.paused && save) this.save_world();
	},
	resume: function() {
		setTimeout(_ => {
			if(this.can_resume) {
				Sound.loadplay_sound("click.ogg");
				if(this.playing_music)
					Sound.play_sound(this.music_name);

				pause_section.style.display = "none";
				controls.lock();
				this.paused = false;
				this.can_resume = false;
			}
		}, 100);
	},
	set_world: function() {
		let world = saving.load(this.world_name);

		if(world) {
			chunks = world.chunks;
			WORLD_SIZE = world.world_size;
			fix_all_gen_vars();

			noise.seed(this.seed = world.seed);
			
			let pos = world.position, rot = world.rotation;
			camera.position.x = pos.x;
			camera.position.y = pos.y;
			camera.position.z = pos.z;
			camera.rotation.isEuler = true;
			camera.rotation.x = rot.x;
			camera.rotation.y = rot.y;
			camera.rotation.z = rot.z;
		} else camera.position.x = randomIntNumber(0, WORLD_BORDER), camera.position.z = randomIntNumber(0, WORLD_BORDER), camera.position.y = 100, generation.generate_world();
	},
	mobileResize: function() {
		mobile.push_elems();
		mobile.belems.jump.style.top = `${window.innerHeight - 172}px`;
		mobile.belems.jump.style.left = `${window.innerWidth - 128}px`;
		mobile.belems.left.style.top = `${window.innerHeight - 172}px`;
		mobile.belems.right.style.top = `${window.innerHeight - 172}px`;
		mobile.belems.backward.style.top = `${window.innerHeight - 124}px`;
		mobile.belems.forward.style.top = `${window.innerHeight - 220}px`;
		mobile.calculate_buttons();
	},
	resize: function() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		
		pointer.style.left = `${window.innerWidth / 2 - pointer.width / 2}px`;
		pointer.style.top = `${window.innerHeight / 2 - pointer.height / 2}px`;
		wcm_elem.style.left = `${window.innerWidth / 2 - 200}px`;
		wcm_elem.style.top = `${window.innerHeight / 2 - 150}px`;
		wm_elem.style.left = `${window.innerWidth / 2 - 200}px`;
		wm_elem.style.top = `${window.innerHeight / 2 - 200}px`;
		wdm_elem.style.left = `${window.innerWidth / 2 - 200}px`;
		wdm_elem.style.top = `${window.innerHeight / 2 - 250}px`;

		if(mobile.isInMobile)
			this.mobileResize();

		if(this.paused)
			renderer.render(scene, camera);
	},
	saving_anim: function() {
		if(!this.doing_saving_anim) {
			this.doing_saving_anim = true;
			saving_anim_elem.style.display = "block";

			setTimeout(_ => {
				this.doing_saving_anim = false;
				saving_anim_elem.style.display = "none";
			}, 2000);
		}
	},
	quit: function(remove) {
		Sound.loadplay_sound("click.ogg");
		if(mobile.activated) game.getElement("mobile_controls").style.display = "none";
		this.save_world();
		game_ui_section.style.display = "none";
		pause_section.style.display = "none";
		saving_world_elem.style.display = "block";
		document.removeEventListener("touchstart", mobile.touch_start);
		document.removeEventListener("touchmove", mobile.touch_move);
		document.removeEventListener("touchend", mobile.touch_end);
		document.body.removeChild(renderer.domElement);

		setTimeout(_ => {
			this.GAME_STARTED = false;
			saving_world_elem.style.display = "none";
			clearInterval(this.save_interval_id);
			this.timer = 0;
			this.can_pause = true;
			this.can_resume = true;
			this.paused = false;
			this.last_item = 0;
			this.seed = randomIntNumber(-65536, 65536);
			this.detect_worlds();

			chunks = [];
			placed_blocks = [];
			player.stop();
			timer.stop();
			this.getElement("menu").style.display = "block";
			renderer.clear();
		}, 1000);
	},
	enter_scene: function(id0, id1, play = true) {
		if(play)
			Sound.loadplay_sound("click.ogg");

		this.getElement(id0).style.display = "block";
		this.getElement(id1).style.display = "none";
	},
	world_creation: function(num) {
		Sound.loadplay_sound("click.ogg");

		this.world_name = this.world_names[num - 1];
		this.getElement("worlds_menu").style.display = "none";

		if(this.existent_worlds.includes(`world_${this.world_name}`))
			this.start();
		else
			document.getElementById("world_creation_menu").style.display = "block";
	},
	delete_world: function(num) {
		let toDelete = this.world_names[num - 1];
		localStorage.removeItem(`world_${toDelete}`);

		this.detect_worlds();
		this.enter_scene("worlds_menu", "worlds_deletion_menu");
	},
	detect_worlds: function() {
		this.existent_worlds = [];

		for(let i = 0; i < localStorage.length; i++) {
			let world = localStorage.key(i);

			if(world.includes("world")) this.existent_worlds.push(world);
		}

		this.detect_world_size();
		this.detect_world_size("t1");
	},
	detect_world_size: function(start = "t") {
		let worlds_text = [`${start}world1`, `${start}world2`, `${start}world3`, `${start}world4`, `${start}world5`],
		worlds_elems = [];

		for(let i in worlds_text)
			worlds_elems.push(document.getElementById(worlds_text[i]));

		for(let i in worlds_elems) {
			let world_name = ["one", "two", "three", "four", "five"][i],
			elem = worlds_elems[i],
			world = localStorage.getItem(`world_${world_name}`);

			if(world) {
				let size = world.length,
				byteType = "B";

				if(size > 1024)
					byteType = "KB", size = (size / 1024).toFixed(1);

				if(size > 1024)
					byteType = "MB", size = (size / 1024).toFixed(1);

				elem.innerText = `World ${parseInt(i) + 1}, Size: ${size}${byteType}`;
			} else
				elem.innerText = `World ${parseInt(i) + 1}`;
		}
	},
	getElement: function(id) {
		return document.getElementById(id);
	}
};