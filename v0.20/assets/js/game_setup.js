const gameCtx = {
	dt: 1/60
}, skyColor = "rgba(53, 237, 255)",
vec3toList = ({x, y, z}) => {
	return {x, y, z};
},
randomIntNumber = (min, max) => {
	return Math.floor(Math.random() * ((max + 1) - min) + min);
},
intersect = (x1, y1, z1, w1, h1, d1, x2, y2, z2, w2, h2, d2) => {
	return (x1 - w1/2 <= x2 + w2/2 && x1 + w1/2 >= x2 - w2/2) &&
		(y1 - h1/2 <= y2 + h2/2 && y1 + h1/2 >= y2 - h2/2) &&
		(z1 - d1/2 <= z2 + d2/2 && z1 + d1/2 >= z2 - d2/2);
},
set_fog = () => {
	//fog = (options.render_distance + 1) * 50 + 40;
	fog = 1000;
},
fix_all_gen_vars = () => {
	CHUNKS_COUNT = WORLD_SIZE * WORLD_SIZE;
	CHUNK_DISTANCE = WORLD_SIZE + 1;
	WORLD_BORDER = WORLD_SIZE * CHUNK_SIZE * 5 - 5;
	set_fog();
};

let options = {
	lightsEnabled: false,
	sensitivity: 100,
	fov: 75,
	render_distance: 2
}, CHUNK_SIZE = 16, WORLD_SIZE = 2, CHUNK_DISTANCE = WORLD_SIZE + 1, _WORLD_DEPTH_ID = [4, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0], CHUNK_HEIGHT = _WORLD_DEPTH_ID.length,
MIN_WORLD_Y = -50, WORLD_BORDER = WORLD_SIZE * CHUNK_SIZE * 5 - 5, CHUNK_B_SIZE = CHUNK_SIZE * 5, GEN_AMPLITUDE = 32, HIGHEST_WORLD_Y = GEN_AMPLITUDE / 2 * 5,
CHUNKS_COUNT = WORLD_SIZE * WORLD_SIZE, fog = 150;

set_fog();

Sound.path = "assets/audio";
Sound.load_sound("calm1.ogg");
Sound.load_sound("calm2.ogg");
Sound.load_sound("calm3.ogg");
Sound.load_sound("click.ogg");