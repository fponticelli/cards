package cards.ui;

import cards.components.Component;
import cards.ui.fragments.FragmentMapper;
import cards.ui.input.RuntimeObjectEditor;
import js.html.Element;
import cards.ui.fragments.Fragment;
import cards.properties.ValueProperty;
using thx.stream.Emitter;

class ContextView {
  var editor : RuntimeObjectEditor;
  var container : Element;
  var parent : Component;
  var mapper : FragmentMapper;
  public function new(document : Document, mapper : FragmentMapper, container : Element, parent : Component) {
    this.container = container;
    this.parent = parent;
    this.mapper = mapper;
    resetEditor();
    document.article.fragment.either(setFragmentStatus, resetEditor);
  }

  function resetEditor() {
    if(null != editor)
      editor.dispose();
    container.innerHTML = "";
  }

  function setFragmentStatus(fragment : Fragment) {
    resetEditor();
    trace(fragment);
    var fields = mapper
      .getAttachedPropertiesForFragment(fragment)
      .map(function(info) {
        //var value = cast(fragment.component.properties.get(info.name), ValueProperty<Dynamic>);
        return {
          name : info.name,
          type : info.type,
          optional : false
        };
      })
      .concat(
        mapper.getAttachablePropertiesForFragment(fragment)
          .map(function(info) {
            return {
              name : info.name,
              type : info.type,
              optional : true
            };
          })
      );
    editor = new RuntimeObjectEditor(container, parent, fields);
    // TODO wire field values somehow
  }
}