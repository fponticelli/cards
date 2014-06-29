package ui;

import js.Browser;
import sui.components.Component;
import sui.components.ComponentOptions;
import js.html.Element;
import sui.properties.Visible;
import thx.Assert;
import steamer.Consumer;
import steamer.Value;
using steamer.dom.Dom;
import dom.Dom;
import ui.AnchorPoint;

class FrameOverlay {
	public var component(default, null) : Component;
	public var visible(default, null) : Visible;
	public var anchorElement(default, null) : Element;
	var my : AnchorPoint;
	var at : AnchorPoint;
	public function new(options : ComponentOptions) {
		if(null == options.el && null == options.template)
			options.template = '<div class="frame-overlay"></div>';
		component = new Component(options);
		visible = new Visible(component, false);
		function clear(_) {
			visible.value = false;
		}
		visible.stream
			.filter(function(b) {
				return !b;
			})
			.feed(function(_) {
				Browser.document.removeEventListener('mouseup', clear, false);
			});
		visible.stream
			.filter(function(b) {
				return b;
			})
			.feed(function(_) {
				Browser.document.addEventListener('mouseup', clear, false);
				reposition();
			});
		anchorElement = Browser.document.body;
	}

	public function anchorTo(el : Element, ?my : AnchorPoint, ?at : AnchorPoint) {
		anchorElement = el;
		this.my = null == my ? TopLeft : my;
		this.at = null == at ? BottomLeft : at;
		if(visible.value)
			reposition();
	}

	public function reposition() {
		if(!component.isAttached) {
			var parent = [Query.first(Config.selectors.app), Browser.document.body].filter(function(v) return null != v).shift();
			component.appendTo(parent);
		}
		var style = component.el.style;
		style.position = "fixed";

		var atrect = anchorElement.getBoundingClientRect(),
			myrect = component.el.getBoundingClientRect(),
			x = 0.0,
			y = 0.0;
		// AT Y
		switch at {
			case TopLeft, Top, TopRight:
				y = atrect.top;
			case Left, Center, Right:
				y = atrect.top + atrect.height / 2;
			case BottomLeft, Bottom, BottomRight:
				y = atrect.top + atrect.height;
		}
		// AT X
		switch at {
			case TopLeft, Left, BottomLeft:
				x = atrect.left;
			case Top, Center, Bottom:
				x = atrect.left + atrect.width / 2;
			case TopRight, Right, BottomRight:
				x = atrect.left + atrect.width;
		}
		// MY Y
		switch my {
			case TopLeft, Top, TopRight:
				y -= 0;
			case Left, Center, Right:
				y -= myrect.height / 2;
			case BottomLeft, Bottom, BottomRight:
				y -= myrect.height;
		}
		// MY X
		switch my {
			case TopLeft, Left, BottomLeft:
				x -= 0;
			case Top, Center, Bottom:
				x -= myrect.width / 2;
			case TopRight, Right, BottomRight:
				x -= myrect.width;
		}
		style.top  = y + 'px';
		style.left = x + 'px';
	}
}