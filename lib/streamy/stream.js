import Timer from 'ui/timer';

let _listeners = Symbol(),
	_cancel = Symbol();

class Source {
	constructor(callback) {
		// TODO, replace with Map or WeakMap?
		this[_listeners] = [];
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
	cancelOn(source) {
		let ƒ;
		ƒ = () => {
			source.unsubscribe(ƒ);
			this.cancel();
		};
		source.subscribe(ƒ);
		return this;
	}
	subscribe(ƒ) {
		this[_listeners].push(ƒ);
		return this;
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
	wrap(ƒ) {
		ƒ(this);
		return this;
	}
}

class PushSource extends Source {
	constructor() {
		super((sink) => this.push = sink);
	}
}

class CancelableSource extends PushSource {
	constructor(cancelƒ) {
		super();
		this[_cancel] = cancelƒ.bind(this);
	}
	cancel() {
		this[_cancel]();
		super();
	}
}

// should I propagate the cancel method?
let Stream = {
	subscribe(source, ƒ) {
		let bƒ,
			stream = new CancelableSource(function() {
				source.unsubscribe(bƒ);
			});
		bƒ = ƒ.bind(null, stream);
		source.subscribe(bƒ);
		return stream;
	},
	map(source, ƒ) {
		return this.subscribe(source, (stream, value) => stream.push(ƒ(value)));
	},
	filter(source, ƒ) {
		return this.subscribe(source, (stream, value) => { if(ƒ(value)) stream.push(value) });
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
			unsubs = [],
			stream = new CancelableSource(() => { unsubs.map((source, i) => sources[i].unsubscribe(unsubs[i])) }),
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
				sources[i].subscribe(unsubs[i] = (v) => {
					values[i] = v;
					flags[i] = true;
					update();
				});
			})(i);
		}
		return stream;
	},
	spread(source, ƒ) {
		return this.subscribe(source, (stream, arr) => stream.push(ƒ.apply(null, arr)));
	},
	flatMap(source) {
		return this.subscribe(source, (stream, arr) => {
			for(let v in arr)
				stream.push(v);
		});
	},
	merge(...sources) {
		let stream,
			ƒ = (v) => stream.push(v);
		stream = new CancelableSource(() => {
			sources.map((source) => source.unsubscribe(ƒ));
		});
		sources.map((source) => source.subscribe(ƒ));
		return stream;
	},
	interval(ms, value) {
		let id,
			stream = new CancelableSource(function() { clearInterval(id); });
		id = setInterval(() => stream.push(value), ms);
		return stream;
	},
	delay(ms, value) {
		let id,
			stream = new CancelableSource(function() { clearTimeout(id); });
		id = setTimeout(() => {
			stream.push(value);
			// cancel needs to happen after the push is realized
			Timer.immediate(stream.cancel.bind(stream));
		}, ms);
		return stream;
	},
	reduce(source, acc, ƒ) {
		return this.subscribe(source, (stream, value) => stream.push(acc = ƒ(acc, value)));
	},
	feed(source, dest) {
		return this.subscribe(source, (stream, value) => {
			stream.push(value);
			dest.push(value);
		});
	},
	fromArray(values) {
		let stream = new PushSource();
		values.map((v) => stream.push(v));
		return stream;
	},
	sequence(values, interval, repeat = false) {
		let id,
			stream = new CancelableSource(function() { clearInterval(id); }),
			index = 0;

		id = setInterval(() => {
			if(index === values.length) {
				if(repeat) {
					index = 0;
				} else {
					clearInterval(id);
					this.cancel();
					return;
				}
			}
			stream.push(values[index++]);
		}, interval);
		return stream;
	}
	// TODO
	// until(ƒ)
	// take(n)
	// skip(n)
	// throttle
	// field(name)
	// method(name, ...args)
}

export { Stream, Source, PushSource };