package cards.ui.input;

import cards.model.SchemaType;

enum Diff {
  RemoveItem;
  AddItem;
  SetValue(value : TypedValue);
}