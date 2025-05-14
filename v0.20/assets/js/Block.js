class Block {
	constructor(x, y, z, i, placed = false) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.index = i;
		this.placed = placed;
	}

	display() {
		let b = blocks[this.index];

		b.mesh.setMatrixAt(b.count, new THREE.Matrix4().makeTranslation(this.x, this.y, this.z));
		b.count++;
	}
}