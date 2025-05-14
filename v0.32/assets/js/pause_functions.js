const f_pause = {
	load_options: function() {
		let config = localStorage.getItem("options");

		if(config) {
			options = JSON.parse(config);

			if(!options.fov)
				options.fov = 75;

			if(!options.sensitivity)
				options.sensitivity = 100;

			if(!options.render_distance)
				options.render_distance = 2;
		}
	},
	save_options: function() {
		localStorage.setItem("options", JSON.stringify(options));
	},
	goto: function(scene) {
		game.enter_scene(`pause${scene}`, `pause${game.pause_scene}`);
		game.pause_scene = scene;
	},
	update_buttons: function() {
		game.getElement("sensitivity_range").value = options.sensitivity;
		game.getElement("lights_text").innerText = `Lights: ${options.lightsEnabled ? "On" : "Off"}`;
		game.getElement("lights2_text").innerText = `Lights: ${options.lightsEnabled ? "On" : "Off"}`;
		game.getElement("sensitivity_text").innerText = `Sensitivity: ${options.sensitivity}%`;
		game.getElement("sensitivity2_text").innerText = `Sensitivity: ${options.sensitivity}%`;
		game.getElement("rd_text").innerText = `Render Distance: ${options.render_distance} Chunks`;
		game.getElement("rd2_text").innerText = `Render Distance: ${options.render_distance} Chunks`;
	},
	update_sliders: function() {
		game.getElement("sensitivity2_range").value = options.sensitivity;
		game.getElement("sensitivity_range").value = options.sensitivity;
		game.getElement("rd_range").value = options.render_distance;
		game.getElement("rd2_range").value = options.render_distance;
	},
	lights: function() {
		Sound.loadplay_sound("click.ogg");
		options.lightsEnabled = !options.lightsEnabled;
		
		if(options.lightsEnabled)
			scene.add(ambient_light, dir_light); else scene.remove(ambient_light, dir_light);

		load_textures();
		generation.update_world(), this.update_buttons(), this.save_options();
	},
	render_distance: function() {
		Sound.loadplay_sound("click.ogg");
		options.render_distance = parseInt(game.getElement("rd_range").value);
		fix_all_gen_vars();
		generation.update_world();

		scene.fog = new THREE.Fog(skyColor, 30, fog);

		this.update_buttons(), this.save_options();
	},
	sensitivity: function() {
		Sound.loadplay_sound("click.ogg");
		options.sensitivity = parseInt(s2r_elem.value);
		controls.setSensitivity(options.sensitivity / 100);
		f_pause.update_buttons();
		f_pause.save_options();
	}
};