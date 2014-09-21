package cards.ui.input;

import thx.stream.Bus;
import cards.model.SchemaType;

interface IRouteEditor extends IEditor {
  public var diff(default, null) : Bus<DiffAt>;
  public function typeAt(path : Path) : SchemaType;
}