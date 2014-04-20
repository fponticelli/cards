import Timer from 'ui/timer';

let _listeners = Symbol();

class Source {
	constructor(callback) {
		// TODO, replace with Map or WeakMap?
		this[_listeners] = [];
		// TODO, delay but don't reduce
		let sink = (value) => {
			Timer.immediate(() => {
				this[_listeners].map(ƒ => ƒ(value));
			});
		};
		callback(sink);
	}
	subscribe(ƒ) {
		this[_listeners].push(ƒ);
	}
	unsubscribe(ƒ) {
		this[_listeners].splice(this[_listeners].indexOf(ƒ), 1);
	}
	map(ƒ) {
		return Stream.map(this, ƒ);
	}
	filter(ƒ) {
		return Stream.filter(this, ƒ);
	}
	unique() {
		return Stream.unique(this);
	}
	log(prefix) {
		return Stream.log(this, prefix);
	}
	toBool() {
		return Stream.toBool(this);
	}
	negate() {
		return Stream.negate(this);
	}
	zip(...others) {
		return Stream.zip(this, ...others);
	}
	spread(ƒ) {
		Stream.spread(this, ƒ);
	}
	flatMap() {
		return Stream.flatMap(this);
	}
	merge(...others) {
		return Stream.merge(this, ...others);
	}
	reduce(acc, ƒ) {
		return Stream.reduce(this, acc, ƒ);
	}
}

class Feed extends Source {
	constructor() {
		super((sink) => this.feed = sink);
	}
}

let Stream = {
	map(source, ƒ) {
		let stream = new Feed();
		source.subscribe((value) => {
			stream.feed(ƒ(value));
		});
		return stream;
	},
	filter(source, ƒ) {
		let stream = new Feed();
		source.subscribe((value) => {
			if(ƒ(value))
				stream.feed(value);
		});
		return stream;
	},
	unique(source) {
		return this.filter(source, (function() {
			var last;
			return function(v) {
				if(last !== v) {
					last = v;
					return true;
				} else {
					return false;
				}
			};
		})());
	},
	toBool(source) {
		return this.map(source, (v) => !!v);
	},
	negate(source) {
		return this.map(source, (v) => !v);
	},
	log(source, prefix) {
		return this.map(source, (v) => {
			if(prefix)
				console.log(prefix, v);
			else
				console.log(v);
			return v;
		});
	},
	zip(...sources) {
		let length = sources.length,
			stream = new Feed(),
			values = new Array(length),
			flags  = new Array(length),
			update = () => {
				if(flags.filter((v) => v).length === length) {
					update = () => stream.feed(values);
					update();
				}
			};

		for(var i = 0; i < length; i++) {
			((i) => {
				sources[i].subscribe((v) => {
					values[i] = v;
					flags[i] = true;
					update();
				});
			})(i);
		}
		return stream;
	},
	spread(source, ƒ) {
		source.subscribe((arr) => {
			ƒ.apply(this, arr);
		});
	},
	flatMap(source) {
		let stream = new Feed();
		source.subscribe((arr) => {
			for(let v in arr)
				stream.feed(v);
		});
		return stream;
	},
	merge(...sources) {
		let stream = new Feed();
		for(let source of sources) {
			source.subscribe((v) => {
				stream.feed(v);
			});
		}
		return stream;
	},
	// TODO no way to cancel
	signal(ms) {
		let stream = new Feed();
		setInterval(() => stream.feed(), ms);
		return stream;
	},
	reduce(source, acc, ƒ) {
		let stream = new Feed();
		source.subscribe((value) => stream.feed(acc = ƒ(acc, value)));
		return stream;
	}
}

export { Stream, Source, Feed };