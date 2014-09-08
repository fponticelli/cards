package cards.ui;

import cards.components.Component;
import cards.components.ComponentOptions;
import thx.Assert;
import cards.ui.fragments.Block;
import cards.ui.fragments.ReadonlyBlock;
import cards.ui.fragments.Fragment;
import thx.stream.Value;
import haxe.ds.Option;
using thx.core.Options;
using thx.stream.Bus;
using thx.stream.Emitter;

class Article {
  public var component(default, null) : Component;
  public var fragment(default, null) : Value<Option<Fragment>>;

  var fragmentStream : Bus<Fragment>;
  var fragments : Map<Fragment, Void -> Void>;

  public function new(options : ComponentOptions) {
    if(null == options.el && null == options.template)
      options.template = '<article></article>';
    component = new Component(options);
    fragments = new Map();
    fragmentStream = new Bus();
    fragment = new Value(None);
    fragmentStream.toOption().feed(fragment);
    var filtered = fragment.filterOption();
    filtered.previous().subscribe(function(fragment : Fragment) {
      fragment.active.set(false);
    });
    filtered.subscribe(function(fragment : Fragment) {
      fragment.active.set(true);
    });
  }

  function addFragment(fragment : Fragment) {
    var focusStream = fragment
          .focus
          .withValue(true)
          .mapValue(function(_) : Fragment return fragment)
          .plug(fragmentStream);
    fragments.set(fragment, focusStream.cancel);
  }

  public function addBlock() {
    var fragment = new Block({
        parent : component,
        container : component.el,
        defaultText : ''
      });
    addFragment(fragment);
    fragment.focus.set(true);
    return fragment;
  }

  public function addReadonly() {
    var fragment = new ReadonlyBlock({
        parent : component,
        container : component.el
      });
    addFragment(fragment);
    return fragment;
  }

  public function removeFragment(fragment : Fragment) {
    if(this.fragment.get().equalsValue(fragment))
      this.fragment.set(None);
    var finalizer = fragments.get(fragment);
    Assert.notNull(finalizer);
    finalizer();
  }
}