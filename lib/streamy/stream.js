import Timer from 'ui/timer';

let _listeners = Symbol(),
	_cancel = Symbol();

class Stream {
	constructor(callback) {
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
	unique(ƒ) {
		return Stream.unique(this, ƒ);
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
	debounce(delay) {
		return Stream.debounce(this, delay);
	}
	sync(synchronizer) {
		return Stream.sync(this, synchronizer);
	}
}

class PushStream extends Stream {
	constructor() {
		super((sink) => this.push = sink);
	}
}

class CancelableStream extends PushStream {
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
Stream.subscribe = function(source, ƒ) {
	let bƒ,
		stream = new CancelableStream(function() {
			source.unsubscribe(bƒ);
		});
	bƒ = ƒ.bind(null, stream);
	source.subscribe(bƒ);
	return stream;
};
Stream.map = function(source, ƒ) {
	return this.subscribe(source, (stream, value) => stream.push(ƒ(value)));
};
Stream.filter = function(source, ƒ) {
	return this.subscribe(source, (stream, value) => { if(ƒ(value)) stream.push(value) });
};
Stream.unique = function(source, ƒ = i => {i}) {
	return this.filter(source, (function() {
		let last, t;
		return function(v) {
			t = ƒ(v);
			if(last !== t) {
				last = t;
				return true;
			} else {
				return false;
			}
		};
	})());
};
Stream.toBool = function(source) {
	return this.map(source, (v) => !!v);
};
Stream.negate = function(source) {
	return this.map(source, (v) => !v);
};
Stream.log = function(source, prefix) {
	return this.map(source, (v) => {
		if(prefix)
			console.log(prefix, v);
		else
			console.log(v);
		return v;
	});
};
Stream.zip = function(...sources) {
	let length = sources.length,
		unsubs = [],
		stream = new CancelableStream(() => { unsubs.map((source, i) => sources[i].unsubscribe(unsubs[i])) }),
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
};
Stream.sync = function(source, synchronizer) {
	let stream   = new PushStream(),
		hasvalue = false,
		haspulse = false,
		value;
	synchronizer.subscribe(() => {
		if(hasvalue) {
			hasvalue = false;
			stream.push(value);
			value = undefined;
		} else if(!haspulse) {
			haspulse = true;
		}
	});
	source.subscribe(v => {
		value = v;
		hasvalue = true;
		if(haspulse) {
			haspulse = false;
			stream.push(value);
			value = undefined;
			hasvalue = false;
		}
	});
	return stream;
};
Stream.debounce = function(source, delay) {
	let stream   = new PushStream(),
		delaying = false,
		t;
	source.subscribe(v => {
		t = v;
		if(delaying)
			return;
		delaying = true;
		setTimeout(function() {
			delaying = false;
			stream.push(t);
		}, delay);
	});
	return stream;
};
Stream.spread = function(source, ƒ) {
	return this.subscribe(source, (stream, arr) => stream.push(ƒ.apply(null, arr)));
};
Stream.flatMap = function(source) {
	return this.subscribe(source, (stream, arr) => {
		for(let v in arr)
			stream.push(v);
	});
};
Stream.merge = function(...sources) {
	let stream,
		ƒ = (v) => stream.push(v);
	stream = new CancelableStream(() => {
		sources.map((source) => source.unsubscribe(ƒ));
	});
	sources.map((source) => source.subscribe(ƒ));
	return stream;
};
Stream.interval = function(ms, value) {
	let id,
		stream = new CancelableStream(function() { clearInterval(id); });
	id = setInterval(() => stream.push(value), ms);
	return stream;
};
Stream.delay = function(ms, value) {
	let id,
		stream = new CancelableStream(function() { clearTimeout(id); });
	id = setTimeout(() => {
		stream.push(value);
		// cancel needs to happen after the push is realized
		Timer.immediate(stream.cancel.bind(stream));
	}, ms);
	return stream;
};
Stream.reduce = function(source, acc, ƒ) {
	return this.subscribe(source, (stream, value) => stream.push(acc = ƒ(acc, value)));
};
Stream.feed = function(source, dest) {
	return this.subscribe(source, (stream, value) => {
		stream.push(value);
		dest.push(value);
	});
};
Stream.fromArray = function(values) {
	let stream = new PushStream();
	values.map((v) => stream.push(v));
	return stream;
};
Stream.sequence = function(values, interval, repeat = false) {
	let id,
		stream = new CancelableStream(function() { clearInterval(id); }),
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
};
// TODO
// until(ƒ)
// take(n)
// skip(n)
// throttle
// field(name)
// method(name, ...args)

export { Stream, PushStream };