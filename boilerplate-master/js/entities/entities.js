/*
A player entity
*/
game.PlayerEntity = me.ObjectEntity.extend({
	// constructor
	init: function(x, y, settings) {
		// call the constructor
		this.parent(x, y, settings);
		
		// set the default and vertical speed
		this.setVelocity(3, 15);

		// adjust the bounding box
		this.updateColRect(8, 48, -1, 0);

		// set the display to follow our position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
	},
	// update the player pos
	update: function() { 
		if (me.input.isKeyPressed('left')) {
			// flip the sprite on horizontal axis
			this.flipX(true);
			// update the entity velocity
			this.vel.x -= this.accel.x * me.timer.tick;
		} else if (me.input.isKeyPressed('right')) {
			// unflip the sprite
			this.flipX(false);
			// update the entity velocity
			this.vel.x += this.accel.x * me.timer.tick;
		} else {
			this.vel.x = 0;
		}
		if (me.input.isKeyPressed('jump')) {
			// make sure we are not already jumping or falling
			if (!this.jumping && !this.falling) {
				// set current val to the max defined value
				// gravity will then do the reset
				this.vel.y = -this.maxVel.y * me.timer.tick;
				// set the jumping flag
				this.jumping = true;
				me.audio.play("jump");
			}
		}

		// check and update player movement
		this.updateMovement();

		// check for collision
		var res = me.game.collide(this);


		if (res) {
			// if we collide with an enemy
			if (res.obj.type == me.game.ENEMY_OBJECT) {
				if ((res.y > 0) && ! this.jumping) {
					// bounce (force jump)
					this.falling = false;
					this.vel.y = -this.maxVel.y * me.timer.tick;
					// set jump flag
					this.jumping = true;
					me.audio.play("stomp");
				} else {
					// lets ficler in case we touched an enemy
					this.renderable.flicker(45);
				}
			}
		}

		// update animation if necessary
		if (this.vel.x != 0 || this.vel.y != 0) {
			// update object animation
			this.parent();
			return true;	
		}

		// else inform the engine we did not perform
		// any update 
		return false;
	}
});	
		
/*
A Coin entity
*/
game.CoinEntity = me.CollectableEntity.extend({
	// extending the init function is not mandatory
	// unless you need to add some extra initialization
	init: function(x, y, settings) {
		// call the parent constructor
		this.parent(x, y, settings);
	},
	//this function is called by the engine when an object is touched by something
	onCollision: function() {
		//this.collidable = true;
		me.audio.play("cling");
		me.game.HUD.updateItemValue("score", 250);
		this.collidable = false;
		me.game.remove(this); // remove the object itself
	}
});

/*
Enemy entity
*/

game.EnemyEntity = me.ObjectEntity.extend({
	init: function(x, y, settings) {
		// define this here instead of tiled
		settings.image = "wheelie_right";
		settings.spritewidth = 64;

		this.parent(x, y, settings);
	
		this.startX = x;
		this.endX = x + settings.width - settings.spritewidth;

		this.pos.x = x + settings.width - settings.spritewidth;
		this.walkLeft = true;
		// walking and jumping speed
		this.setVelocity(4, 6);
		// make it collidable
		this.collidable = true;
		// make it an enemy object
		this.type = me.game.ENEMY_OBJECT;		
	},
	onCollision: function(res, obj) { 
		// res.y > 0 means touched by something on the bottom which means at top for this one
		if (this.alive && (res.y > 0) && obj.falling) {
			this.renderable.flicker(45);
		}
	},
	
	// manage the enemy movement
	update: function() {
		// does nothing if not in the viewport
		if (!this.inViewport)
			return false;

		if (this.alive) {
			if (this.walkLeft && this.pos.x <= this.startX) {
				this.walkLeft = false;
			} else if (!this.walkLeft && this.pos.x >= this.endX) {
				this.walkLeft = true;
			}
			// make it walk
			this.flipX(this.walkLeft);
			this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
		} else {
			this.vel.x = 0;
		}

		// update movement
		this.updateMovement();

		// update animation if necessary
		if (this.vel.x != 0 || this.vel.y != 0) {
			// update object animation
			this.parent();
			return true;
		}
		return true;
	}
});

game.ScoreObject = me.HUD_Item.extend({
	init: function(x, y) {
		// call the parent constructor
		this.parent(x, y);
		// create the font
		this.font = new me.BitmapFont("32x32_font", 32);
		this.font.set("right");
	},
	
	// draw game score
	draw: function(context, x, y) {
		this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
	}
});
