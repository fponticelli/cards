package ui.widgets;

import sui.components.ComponentOptions;

class Tooltip extends FrameOverlay {
	public function new(options : ComponentOptions) {
		super(options);
	}

	public function setContent(html : String) {
		component.el.innerHTML = html;
	}
}