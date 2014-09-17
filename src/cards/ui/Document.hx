package cards.ui;

import cards.components.Component;
import cards.components.ComponentOptions;
import cards.ui.fragments.Block;
import cards.ui.fragments.Fragment;
import cards.ui.fragments.InlineText;
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


    // TODO change this to components
    article.fragment
      .mapValue(function(r) switch r {
        case Some(v):
          return '$v';
        case None:
          return 'no fragment selected';
      })
      .subscribe(statusbar.left.component.el.subscribeHTML());

    toolbar.left.addButton('block', Config.icons.add)
      .clicks.subscribe(function(_) article.addBlock());

    var buttonAddText = toolbar.left.addButton('text', Config.icons.add);
    buttonAddText
      .clicks.subscribe(function(_) {
        var block = getNearestBlock(article.fragment.get().toValue());
        if(null == block)
          return;
        article.addInlineText(block);
      });
    buttonAddText.enabled.set(false);
    article.fragment
      .mapValue(function(r) switch r {
        case Some(v):
          return getNearestBlock(v) != null;
        case None:    return false;
      })
      .feed(buttonAddText.enabled);

    var buttonRemove = toolbar.right.addButton('', Config.icons.remove);
    buttonRemove.enabled.set(false);
    buttonRemove.clicks.subscribe(function(_) {
      article.fragment.get().toValue().component.destroy();
      article.fragment.set(None);
    });
    article.fragment.toBool().feed(buttonRemove.enabled);
  }

  static function getNearestBlock(fragment : Fragment) : Block {
    if(null == fragment)
      return null;
    if(Std.is(fragment, Block))
      return cast fragment;
    return getNearestBlock(fragment.parent);
  }
}