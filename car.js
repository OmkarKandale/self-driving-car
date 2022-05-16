class Car {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.speed = 0;
		this.acceleration = 0.2;
		this.maxSpeed = 3;
		this.friction = 0.05;
		this.angle = 0; // bug fix #2

		this.sensor = new Sensor(this);
		this.controls = new Controls();
	}

	update() {
		this.#move();
		this.sensor.update();
	}

	#move() {
		if (this.controls.forward) {
			// to check its moving forward
			this.speed += this.acceleration;
		}
		if (this.controls.reverse) {
			// to check its moving reverse
			this.speed -= this.acceleration;
		}

		if (this.speed > this.maxSpeed) {
			// to check its moving above maxSpeed
			this.speed = this.maxSpeed;
		}
		if (this.speed < -this.maxSpeed / 2) {
			// to check its moving in reverse with proper speed and negative sign indicates reverve movement
			this.speed = -this.maxSpeed / 2;
		}

		if (this.speed > 0) {
			// removing friction while increasing speed
			this.speed -= this.friction;
		}
		if (this.speed < 0) {
			// adding friction while decreasing speed
			this.speed += this.friction;
		}

		if (Math.abs(this.speed) < this.friction) {
			// bug fix #1
			this.speed = 0;
		}

		if (this.speed != 0) {
			// bug fix #4
			const flip = this.speed > 0 ? 1 : -1;
			if (this.controls.left) {
				this.angle += 0.03 * flip;
			}
			if (this.controls.right) {
				this.angle -= 0.03 * flip;
			}
		}

		// bug fix #3
		this.x -= Math.sin(this.angle) * this.speed;
		this.y -= Math.cos(this.angle) * this.speed;
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(-this.angle);

		ctx.beginPath();
		ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
		ctx.fill();

		ctx.restore();

		this.sensor.draw(ctx);
	}
}
