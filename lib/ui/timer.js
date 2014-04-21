let immediate = require('immediate'),
	Timer = {
	delay(ms, ƒ) {
		if(ƒ)
			return setTimeout(ƒ, ms);
		else
			return new Promise((resolve) => setTimeout(resolve, ms));
	},
	immediate(ƒ) {
		if(ƒ)
			return immediate(ƒ);
		else
			return new Promise((resolve) => immediate(resolve));
	},
	debounce(ƒ, ms = 0) {
		let tid, context, args, laterƒ;
		return function() {
			context = this;
			args = arguments;
			laterƒ = function() {
				if (!immediate) ƒ.apply(context, args);
			};
			clearTimeout(tid);
			tid = setTimeout(laterƒ, ms);
		};
	},
	reduce(ƒ, ms = 0) {
		let tid, context, args;
		return function() {
			context = this;
			args = arguments;
			if(tid) return;
			tid = setTimeout(function() {
				tid = null;
				ƒ.apply(context, args);
			}, ms);
		};
	}
};

export default Timer;