package cards.ui.widgets;

import cards.components.ComponentOptions;

class Tooltip extends FrameOverlay {
  public function new(options : ComponentOptions)
    super(options);

  public function setContent(html : String)
    component.el.innerHTML = html;
}