package ui;

import haxe.Json;
using thx.core.Arrays;
using thx.core.Iterators;
using thx.core.Strings;
import steamer.Producer;
import steamer.Pulse;
import thx.ref.ObjectRef;
import thx.ref.IRef;

class Data {
	var root : ObjectRef;
	var cache : Map<String, IRef>;
	var feed : Pulse<{}> -> Void;

	public var stream(default, null) : Producer<{}>;

	public function new(data : {}) {
		this.feed = function(p){};
		// debounce removes noise
		stream = new Producer(function(feed) {
			this.feed = feed;
		}).debounce(100);
		reset(data);
	}

	function resolve(path : String) {
		var ref = cache.get(path);
		if(null == ref) {
			ref = root.resolve(path);
			if(ref.hasValue())
				cache.set(path, ref);
		}
		return ref;
	}

	public function get(path : String) : Dynamic {
		return resolve(path).get();
	}

	public function hasValue(path : String) : Bool {
		return resolve(path).hasValue();
	}

	public function set(path : String, value : Dynamic) : Data {
		var ref = resolve(path);
		cache.set(path, ref);
		if(ref.get() != value) {
			ref.set(value);
			feed(Emit(toObject()));
		}
		return this;
	}

	public function reset(value : Dynamic) : Data {
		root = new ObjectRef(null);
		cache = new Map();
		if(null != value) {
			set("", value);
		}
		feed(Emit(toObject()));
		return this;
	}

	public function remove(path : String) {
		var ref = cache.get(path);
		if(null == ref) {
			ref = root.resolve(path);
		}

		if(ref.hasValue()) {
			ref.remove();
			feed(Emit(toObject()));
		}
		cache.remove(path);
	}

	public function rename(oldpath : String, newpath : String) {
		if(!hasValue(oldpath) || hasValue(newpath))
			return false;
		var v = get(oldpath);
		remove(oldpath);
		set(newpath, v);
		feed(Emit(toObject()));
		return true;
	}

	public function toObject() : {} {
		return root.get();
	}

	public function toJSON()
		return Json.stringify(toObject());
}