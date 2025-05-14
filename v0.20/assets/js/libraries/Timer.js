class Timer {
	constructor(dt = 1/60) {this.dt = dt}

	start() {
		this.at = 0, this.lt = undefined;

		this.updateProxy = t => {
			if(this.lt) {
				this.at += (t - this.lt) / 1000;

				if(this.at > 1)
					this.at = 1;

				while(this.at > this.dt) {
					this.update(this.dt);
					this.at -= this.dt;
				}
			}

			this.lt = t;
			this.draw();
			
			requestAnimationFrame(this.updateProxy);
		};

		this.updateProxy();
	}

	stop() {
		this.updateProxy = t => {};
	}
}