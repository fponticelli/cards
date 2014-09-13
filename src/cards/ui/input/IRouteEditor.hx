package cards.ui.input;

import thx.stream.Bus;

interface IRouteEditor extends IEditor {
  public var diff(default, null) : Bus<Diff>;
}