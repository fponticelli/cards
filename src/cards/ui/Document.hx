package cards.ui;

import cards.components.Component;
import cards.components.ComponentOptions;
import cards.ui.fragments.Fragment;
import cards.ui.widgets.Toolbar;
import cards.ui.widgets.Statusbar;
using thx.stream.Emitter;
using thx.core.Options;
using thx.stream.dom.Dom;

class Document {
  public var component(default, null) : Component;
  public var toolbar(default, null) : Toolbar;
  public var article(default, null) : Article;
  public var statusbar(default, null) : Statusbar;

  public function new(options : ComponentOptions) {
    component = new Component(options);
    toolbar   = new Toolbar({ parent : component, container : component.el });
    article   = new Article({ parent : component, container : component.el });
    statusbar = new Statusbar({ parent : component, container : component.el });

    var buttonRemove = toolbar.right.addButton('', Config.icons.remove);
    article.fragment.toBool().feed(buttonRemove.enabled);

    var buttonAdd = toolbar.left.addButton('', Config.icons.add);
    buttonAdd.clicks.subscribe(function(_) {
      article.addBlock();
    });

    buttonRemove.enabled.set(false);
    buttonRemove.clicks.subscribe(function(_) {
      article.fragment.get().toValue().component.destroy();
      article.fragment.set(None);
    });
  }
}