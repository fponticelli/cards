package sui.components;

import dom.Dom;
import js.html.Element;

class Component {
	public var children(get, null) : Iterable<Component>;
	public var isAttached(default, null) : Bool = false;
	public var parent(default, null) : Component;
	public var properties(default, null) : Properties;
	public var el(default, null) : Element;
	var list : Array<Component>;

	public function new(options : ComponentOptions) {
		list = [];
		properties = new Properties(this);
		if(null == options.template)
			throw '$this needs a template';
		el = Html.parse(options.template);
		if(null != options.classes)
			el.classList.add(options.classes);
		if(null != options.parent)
			options.parent.add(this);
	}

	public function appendTo(container : Element) {
		container.appendChild(el);
		isAttached = true;
	}

	public function detach() {
		if(!isAttached)
			throw 'Component is not attached';
		el.parentElement.removeChild(el);
		isAttached = false;
	}

	public function destroy() {
		if(null != parent)
			parent.remove(this);
		if(isAttached)
			detach();
		properties.removeAll();
	}

	public function add(child : Component) {
		if(null != child.parent)
			child.parent.remove(child);
		list.push(child);
		child.parent = this;
	}

	public function remove(child : Component) {
		if(!list.remove(child))
			throw '$child is not a child of $this';
		child.parent = null;
	}

	function get_children()
		return list;

	public function toString()
		return Type.getClassName(Type.getClass(this)).split('.').pop();
}