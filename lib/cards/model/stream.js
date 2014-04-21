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
	cancel() {
		this[_listeners] = [];
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
		return Stream.spread(this, ƒ);
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
	feed(destValue) {
		return Stream.feed(this, destValue);
	}
}

class PushSource extends Source {
	constructor() {
		super((sink) => this.push = sink);
	}
}

let Stream = {
	map(source, ƒ) {
		let stream = new PushSource();
		source.subscribe((value) => {
			stream.push(ƒ(value));
		});
		return stream;
	},
	filter(source, ƒ) {
		let stream = new PushSource();
		source.subscribe((value) => {
			if(ƒ(value))
				stream.push(value);
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
			stream = new PushSource(),
			values = new Array(length),
			flags  = new Array(length),
			update = () => {
				if(flags.filter((v) => v).length === length) {
					update = () => stream.push(values);
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
		let stream = new PushSource();
		source.subscribe((arr) => {
			stream.push(ƒ.apply(this, arr));
		});
		return stream;
	},
	flatMap(source) {
		let stream = new PushSource();
		source.subscribe((arr) => {
			for(let v in arr)
				stream.push(v);
		});
		return stream;
	},
	merge(...sources) {
		let stream = new PushSource();
		for(let source of sources) {
			source.subscribe((v) => {
				stream.push(v);
			});
		}
		return stream;
	},
	// TODO no way to cancel
	interval(ms) {
		let stream = new PushSource();
		setInterval(() => stream.push(), ms);
		return stream;
	},
	delay(ms) {
		let stream = new PushSource();
		setTimeout(() => stream.push(), ms);
		return stream;
	},
	reduce(source, acc, ƒ) {
		let stream = new PushSource();
		source.subscribe((value) => stream.push(acc = ƒ(acc, value)));
		return stream;
	},
	feed(source, destValue) {
		let ƒ = (v) => destValue.set(v);
		source.subscribe(ƒ);
		return () => source.unsubscribe(ƒ);
	}
}

export { Stream, Source, PushSource };