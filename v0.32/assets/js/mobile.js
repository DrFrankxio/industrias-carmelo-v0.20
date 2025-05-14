let touching = new Map();

const mobile = {
	touches: [],
	belems: {},
	bpos: {},
	activated: false,
	push_elems: function() {
		this.belems = {};
		this.belems.forward = game.getElement("mc_f");
		this.belems.backward = game.getElement("mc_b");
		this.belems.left = game.getElement("mc_l");
		this.belems.right = game.getElement("mc_r");
		this.belems.jump = game.getElement("mc_j");
	},
	detect: function() {
		this.push_elems();

		if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) this.activated = true;
		if(navigator.userAgent.match(/webOS/i)) alert("We don't support WebOS, sorry!");
	},
	gen_touch: function(touched, touch) {return {touched, x: touch.clientX, y: touch.clientY}},
	calculate_buttons: function() {
		this.bpos.forward = this.belems.forward.getClientRects()[0];
		this.bpos.backward = this.belems.backward.getClientRects()[0];
		this.bpos.left = this.belems.left.getClientRects()[0];
		this.bpos.right = this.belems.right.getClientRects()[0];
		this.bpos.jump = this.belems.jump.getClientRects()[0];
	},
	touch_intersect: function(tx, ty, bx, by, bw, bh) {return (tx <= bx + bw && tx >= bx) && (ty <= by + bh && ty >= by)},
	handle_touch: function() {
		for(let touch of this.touches) {
			if(this.touch_intersect(touch.x, touch.y, this.bpos.forward.x, this.bpos.forward.y, 48, 48))
				touching.set("f", touch.touched); 
			else
				touching.set("f", false);

			if(this.touch_intersect(touch.x, touch.y, this.bpos.backward.x, this.bpos.backward.y, 48, 48))
				touching.set("b", touch.touched); 
			else
				touching.set("b", false);

			if(this.touch_intersect(touch.x, touch.y, this.bpos.left.x, this.bpos.left.y, 48, 48))
				touching.set("l", touch.touched); 
			else
				touching.set("l", false);

			if(this.touch_intersect(touch.x, touch.y, this.bpos.right.x, this.bpos.right.y, 48, 48))
				touching.set("r", touch.touched); 
			else
				touching.set("r", false);

			if(this.touch_intersect(touch.x, touch.y, this.bpos.jump.x, this.bpos.jump.y, 48, 48))
				touching.set("j", touch.touched);
			else
				touching.set("j", false);
		}
	},
	touch_start: function(e) {
		for(let i in e.touches)
			mobile.touches[i] = mobile.gen_touch(true, e.touches[i]);
			
		mobile.handle_touch();
	},
	touch_move: function(e) {
		for(let i in e.touches) {
			if(mobile.touches[i] && mobile.touches[i].touched)
				mobile.touches[i] = mobile.gen_touch(true, e.touches[i]);
		}

		mobile.handle_touch();
	},
	touch_end: function(e) {
		for(let i in e.touches)
			mobile.touches[i] = mobile.gen_touch(false, e.touches[i]);

		mobile.handle_touch();
	}
};