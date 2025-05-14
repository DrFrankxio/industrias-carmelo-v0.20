// Initializes Game
let scene = new THREE.Scene(), renderer = new THREE.WebGLRenderer({precision: "lowp"}),
camera = new THREE.PerspectiveCamera(options.fov, window.innerWidth / window.innerHeight, 0.1, fog);

const pointer = game.getElement("pointer"), timer = new Timer(gameCtx.dt), pause_section = game.getElement("pause_menu"),
game_ui_section = game.getElement("game_ui"), saving_anim_elem = game.getElement("saving"),saving_world_elem = game.getElement("saving_world"),
selected_elem = game.getElement("selected_elem"), wcm_elem = game.getElement("world_creation_menu"), wm_elem = game.getElement("worlds_menu"),
wdm_elem = game.getElement("worlds_deletion_menu"), ambient_light = new THREE.AmbientLight(0xffffff, .7), dir_light = new THREE.DirectionalLight(0xffffff, .3);

// mobile.detect();
dir_light.position.set(0, 1, 0);
scene.background = new THREE.Color(skyColor);
scene.fog = new THREE.Fog(skyColor, 30, fog);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

f_pause.load_options();
f_pause.update_sliders();
f_pause.update_buttons();
load_textures();
game.detect_worlds();

let chunks = [], next_song_timeout, next_song, last_song;
noise.seed(game.seed);

const calculate_next_song = () => {
	next_song_timeout = randomIntNumber(60, 600);
	next_song = (randomIntNumber(1, 1000) % 3) + 1;
	last_song = next_song;
}

calculate_next_song();

// Update Function
timer.update = dt => {
	if(game.GAME_STARTED) {
		game.timer += dt;

		if(keys.get("p"))
			game.pause();
		else
			game.can_pause = true;

		if(!game.paused) {
			game.music_timer += dt;

			player.check_controls();
			player.update();

			if(player.selectedItem != game.last_item) {
				selected_elem.src = `${TEXTURE_FLAG}${block_textures[player.selectedItem]}.png`;
				game.last_item = player.selectedItem;
			}

			if(game.music_timer > next_song_timeout) {
				game.music_timer = 0;

				if(game.playing_music)
					next_song_timeout += randomIntNumber(60, 600);
				else {
					game.playing_music = true;
					game.music_name = `calm${next_song}.ogg`;

					Sound.play_sound(game.music_name);
				}

				calculate_next_song();
			}
		}
	}
};

timer.draw = () => {
	if(game.GAME_STARTED && !game.paused)
		renderer.render(scene, camera);
};

game.resize();
window.addEventListener("resize", game.resize);