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

		this.controls = new Controls();
	}

	update() {
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

		this.y -= this.speed;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.rect(
			this.x - this.width / 2,
			this.y - this.height / 2,
			this.width,
			this.height
		);
		ctx.fill();
	}
}
