package ui;

import steamer.MultiProducer;
import sui.components.Component;
import sui.components.ComponentOptions;
import thx.Assert;
import ui.fragments.Block;
import ui.fragments.ReadonlyBlock;
import ui.fragments.Fragment;
import thx.stream.Value;
import haxe.ds.Option;
using thx.core.Options;
using thx.stream.Emitter;

class Article {
  public var component(default, null) : Component;
  public var fragment(default, null) : Value<Option<Fragment>>;

  var fragmentStream : MultiProducer<Fragment>;
  var fragments : Map<Fragment, Void -> Void>;

  public function new(options : ComponentOptions) {
    if(null == options.el && null == options.template)
      options.template = '<article></article>';
    component = new Component(options);
    fragments = new Map();
    fragmentStream = new MultiProducer();
    fragment = new Value(None);
    fragmentStream.toOption().feed(fragment);
    var filtered = fragment.filterOption();
    filtered.previous().feed(function(fragment : Fragment) {
      fragment.active.value = false;
    });
    filtered.feed(function(fragment : Fragment) {
      fragment.active.value = true;
    });
  }

  function addFragment(fragment : Fragment) {
    var addFocus = fragment
      .focus
      .filter(function(v) return v)
      .map(function(_) : Fragment return fragment);
    fragmentStream.add(addFocus);
    fragments.set(fragment, function() {
      fragmentStream.remove(addFocus);
    });
  }

  public function addBlock() {
    var fragment = new Block({
        parent : component,
        container : component.el,
        defaultText : 'block'
      });
    addFragment(fragment);
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
    if(this.fragment.value.equalsValue(fragment))
      this.fragment.value = None;
    var finalizer = fragments.get(fragment);
    Assert.notNull(finalizer);
    finalizer();
  }
}