package ui;

import haxe.Json;
using thx.core.Arrays;
using thx.core.Iterators;
using thx.core.Strings;
import thx.ref.ObjectRef;
import thx.ref.IRef;

class Data {
	var root : ObjectRef;
	var cache : Map<String, IRef>;

	public function new(data : {}) {
		root = new ObjectRef(null);
		cache = new Map();
		if(null != data)
			set("", data);
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
		ref.set(value);
		return this;
	}

	public function remove(path : String) {
		var ref = cache.get(path);
		if(null == ref) {
			root.resolve(path).remove();
		} else {
			ref.remove();
			cache.remove(path);
		}
	}

	public function rename(oldpath : String, newpath : String) {
		if(!hasValue(oldpath) || hasValue(newpath))
			return false;
		var v = get(oldpath);
		remove(oldpath);
		set(newpath, v);
		return true;
	}

	public function toObject() : {} {
		return root.get();
	}

	public function toJSON()
		return Json.stringify(toObject());
}