package dom;

import js.html.Element;
import thx.Nil;
import promhx.Promise;

class Html {
	public static function parseList(html : String) {
		var el = js.Browser.document.createElement('div');
		el.innerHTML = html;
		return el.childNodes;
	}

	public inline static function parseAll(html : String) {
		return H.toArray(parseList(html));
	}

	public inline 	static function parse(html : String) {
		return parseList(html)[0];
	}
}

class Dom {
	public static function ready() : Promise<Nil> {
		var deferred = new promhx.Promise();
		js.Browser.document.addEventListener("DOMContentLoaded", function(_) {
			deferred.resolve(nil);
		}, false);
		return deferred;
	}
}

class Query {
	static var doc : Element = untyped __js__('document');
	public static function first(selector : String, ?ctx : js.html.Element) {
		return (ctx != null ? ctx : doc).querySelector(selector);
	}

	public static function list(selector : String, ?ctx : js.html.Element) {
		return (ctx != null ? ctx : doc).querySelectorAll(selector);
	}

	public inline static function all(selector : String, ?ctx : js.html.Element) : Array<Element> {
		return H.toArray(list(selector, ctx));
	}
}

private class H {
	public inline static function toArray(list : js.html.NodeList) : Array<Element>
		return untyped __js__('Array.prototype.slice.call')(list, 0);
}