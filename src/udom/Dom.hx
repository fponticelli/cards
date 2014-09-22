package udom;

using StringTools;
import js.html.Element;
import js.html.NodeList;
import thx.core.Nil;
import thx.promise.Promise;

class Html {
  public static function parseList(html : String) : NodeList {
    var el = js.Browser.document.createElement('div');
    el.innerHTML = html;
    return el.childNodes;
  }

  public inline static function parseAll(html : String) : Array<Element> {
    return H.toArray(parseList(html.trim()));
  }

  // TODO: unsafe cast
  public inline static function parse(html : String) : Element {
    return cast parseList(html.ltrim())[0];
  }
}

class Query {
  static var doc : Element = untyped __js__('document');
  public static function first(selector : String, ?ctx : js.html.Element) : Element {
    return (ctx != null ? ctx : doc).querySelector(selector);
  }

  public static function list(selector : String, ?ctx : js.html.Element) : NodeList {
    return (ctx != null ? ctx : doc).querySelectorAll(selector);
  }

  public inline static function all(selector : String, ?ctx : js.html.Element) : Array<Element> {
    return H.toArray(list(selector, ctx));
  }

  public static function getElementIndex(el : Element) {
    var index = 0;
    while(null != (el = el.previousElementSibling))
      index++;
    return index;
  }

  public static function childOf(child : Element, parent : Element)
    return null != child && child.parentElement == parent ? child : null;

  public static function childrenOf(children : Array<Element>, parent : Element) : Array<Element>
    return children.filter(function(child) return child.parentElement == parent);
}

private class H {
  public inline static function toArray(list : js.html.NodeList) : Array<Element>
    return untyped __js__('Array.prototype.slice.call')(list, 0);
}