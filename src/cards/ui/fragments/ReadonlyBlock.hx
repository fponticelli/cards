package cards.ui.fragments;

import thx.stream.Value;
import cards.components.Component;
import cards.components.ComponentOptions;
using thx.stream.dom.Dom;
using thx.stream.Emitter;
using thx.stream.IStream;

class ReadonlyBlock implements Fragment {
  public var name(default, null) : String = 'readonly';
  public var component(default, null) : Component;
  public var focus(default, null) : Value<Bool>;
  public var active(default, null) : Value<Bool>;
  public var uid(default, null) : String;

  var focusStream : IStream;
  public function new(options : FragmentOptions) {
    if(null == options.el && null == options.template)
      options.template = '<section class="readonly block" tabindex="0">readonly</div>';

    component = new Component(options);
    focus = new Value(false);
    active = new Value(false);
    uid = null != options.uid ? options.uid : thx.core.UUID.create();

    focusStream = component.el.streamEvent('focus')
      .toTrue()
      .merge(component.el.streamEvent('blur').toFalse())
      .feed(focus);

    active.subscribe(component.el.subscribeToggleClass('active'));
  }

  public function destroy() {
    focusStream.cancel();
    component.destroy();
  }

  public function toString()
    return name;
}