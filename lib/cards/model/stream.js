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
	log() {
		return Stream.log(this);
	}
	toBool() {
		return Stream.toBool(this);
	}
	negate() {
		return Stream.negate(this);
	}
	zip(...others) {
		return Stream.zip([this].concat(sources));
	}
	spread(ƒ) {
		Stream.spread(this, ƒ);
	}
	flatMap() {
		return Stream.flatMap(this);
	}
	merge(...sources) {
		return Stream.merge([this].concat(sources));
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
	log(source) {
		return this.map(source, (v) => {
			console.log(v);
			return v;
		});
	},
	zip(...sources) {
		let length = sources.length,
			stream = new Feed(),
			values = new Array(length),
			flags  = new Array(length);

		function update() {
			if(flags.filter((v) => v).length === length)
				stream.feed(values);
		}

		for(let i of sources) {
			sources[i].subscribe((v) => {
				values[i] = v;
				flags[i] = true;
			});
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
		for(let i of sources) {
			sources[i].subscribe((v) => {
				stream.feed(v);
			});
		}
		return stream;
	}
}

export { Stream, Source, Feed };