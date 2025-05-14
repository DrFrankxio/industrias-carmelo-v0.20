let keys = new Map();

document.addEventListener("keydown", e => keys.set(e.key, true));
document.addEventListener("keyup", e => keys.set(e.key, false));

const controls = new THREE.PointerLockControls(camera, document.body, options.sensitivity / 100);

document.body.addEventListener("click", e => {
	if(controls.isLocked) {
		let rc = new THREE.Raycaster(), point = new THREE.Vector2(0, 0), inter, next = false, dis = Infinity, x = y = z = 0;
		rc.setFromCamera(point, camera);

		for(let {mesh} of blocks) {
			let [int] = rc.intersectObject(mesh);

			if(int != undefined && int.distance < 40 && int.distance < dis) {
				next = true;
				inter = int;
				dis = int.distance;
			}
		}

		if(inter != undefined && dis < 40) {
			let matInd = inter.face.materialIndex,
			position = inter.point,
			inc = e.button == 0 ? 2.5 : -2.5;

			switch(matInd) {
				case 0:
					x = position.x - inc;
					y = Math.round(position.y / 5) * 5;
					z = Math.round(position.z / 5) * 5;
				break;

				case 1:
					x = position.x + inc;
					y = Math.round(position.y / 5) * 5;
					z = Math.round(position.z / 5) * 5;
				break;

				case 2:
					x = Math.round(position.x / 5) * 5;
					y = position.y - inc;
					z = Math.round(position.z / 5) * 5;
				break;

				case 3:
					x = Math.round(position.x / 5) * 5;
					y = position.y + inc;
					z = Math.round(position.z / 5) * 5;
				break;

				case 4:
					x = Math.round(position.x / 5) * 5;
					y = Math.round(position.y / 5) * 5;
					z = position.z - inc;
				break;

				case 5:
					x = Math.round(position.x / 5) * 5;
					y = Math.round(position.y / 5) * 5;
					z = position.z + inc;
				break;
			}

			y = Math.round(y);

			if(e.button == 0) {
				let [chunk] = generation.identify_chunk(x, z), idx = null;

				for(let i in chunk.blocks) {
					let b = chunk.blocks[i];

					if(b.x == x && b.y == y && b.z == z) {
						idx = b.index;

						if(b.placed) {
							for(let j in placed_blocks) {
								let pb = placed_blocks[j];

								if(pb.x == x && pb.y == y && pb.z == z) {
									placed_blocks.splice(j, 1);

									break;
								}
							}
						}

						chunk.blocks.splice(i, 1);

						scene.remove(blocks[idx].mesh);

						blocks[idx].mesh = new THREE.InstancedMesh(_BOXGEOMETRY, blocks[idx].material, get_instanced_num(idx));
						blocks[idx].count = 0;

						for(let chnk of chunks) {
							for(let bl of chnk.blocks) {
								if(bl.index != idx)
									continue;

								bl.display();
							}
						}

						scene.add(blocks[idx].mesh);

						break;
					}
				}
			} else if(e.button == 2 && next) {
				let idx = player.selectedItem, b = new Block(x, y, z, idx, true);

				if(!intersect(b.x, b.y + 2.5, b.z, 5, 5, 5, camera.position.x, camera.position.y, camera.position.z, player.w, player.h, player.d)) {
					generation.identify_chunk(x, z)[0].blocks.push(b);
					placed_blocks.push(b);

					scene.remove(blocks[idx].mesh);

					blocks[idx].mesh = new THREE.InstancedMesh(_BOXGEOMETRY, blocks[idx].material, get_instanced_num(idx));
					blocks[idx].count = 0;

					for(let chnk of chunks) {
						for(let bl of chnk.blocks) {
							if(bl.index != idx)
								continue;

							bl.display();
						}
					}

					scene.add(blocks[idx].mesh);
				}
			}
		}
	} else if(game.GAME_STARTED && !game.paused)
		controls.lock();
});

controls.addEventListener("unlock", _ => {
	keys = new Map();

	game.pause(false);
});