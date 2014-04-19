let Timer = {
	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	},
	immediate() {
		return this.delay(0);
	},
	debounce(ƒ, ms = 0) {
		var tid;
		return () => {
			var context = this,
				args = arguments,
				laterƒ = () => {
					if (!immediate) ƒ.apply(context, args);
				};
			clearTimeout(tid);
			tid = setTimeout(laterƒ, ms);
		};
	},
	reduce(ƒ, ms = 0) {
		var tid, context, args;
		return () => {
			context = this;
			args = arguments;
			if(tid) return;
			tid = setTimeout(function() {
				tid = null;
				ƒ.apply(context, args);
			}, ms);
		};
	}
}

export default Timer;