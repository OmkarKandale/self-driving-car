class Car {
	constructor(x, y, width, height, controlType, maxSpeed = 3) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.speed = 0;
		this.acceleration = 0.2;
		this.maxSpeed = maxSpeed; //bug fix #10
		this.friction = 0.05;
		this.angle = 0; // bug fix #2
		this.damaged = false;

		if (controlType != "DUMMY") {
			//bug fix #12
			this.sensor = new Sensor(this);
		}
		this.controls = new Controls(controlType); //bug fix #9
	}

	update(roadBorders, traffic) {
		if (!this.damaged) {
			this.#move();
			this.polygon = this.#createPolygon();
			this.damaged = this.#accessDamage(roadBorders, traffic);
		}
		if (this.sensor) {
			this.sensor.update(roadBorders, traffic);
		}
	}

	#accessDamage(roadBorders, traffic) {
		for (let i = 0; i < roadBorders.length; i++) {
			if (polysIntersect(this.polygon, roadBorders[i])) {
				return true;
			}
		}
		for (let i = 0; i < traffic.length; i++) {
			if (polysIntersect(this.polygon, traffic[i].polygon)) {
				return true;
			}
		}
		return false;
	}

	#createPolygon() {
		const points = [];
		const rad = Math.hypot(this.width, this.height) / 2;
		const alpha = Math.atan2(this.width, this.height);
		points.push({
			x: this.x - Math.sin(this.angle - alpha) * rad,
			y: this.y - Math.cos(this.angle - alpha) * rad,
		});
		points.push({
			x: this.x - Math.sin(this.angle + alpha) * rad,
			y: this.y - Math.cos(this.angle + alpha) * rad,
		});
		points.push({
			x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
			y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
		});
		points.push({
			x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
			y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
		});
		return points;
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

	draw(ctx, color) {
		if (this.damaged) {
			ctx.fillStyle = "gray";
		} else {
			ctx.fillStyle = color;
		}
		ctx.beginPath();
		ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
		for (let i = 1; i < this.polygon.length; i++) {
			ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
		}
		ctx.fill();

		if (this.sensor) {
			this.sensor.draw(ctx);
		}
	}
}
