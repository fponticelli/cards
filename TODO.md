- rewiring switched editor doesn't work
- focus on switched editor doesn't work
- disabling/enabling 2 buttons doesn't work

- add CodeTransform

+ extract field value editor from ContextField
+ remove expression evaluation from contextview
+ use standard editors to feed ValueProperty
- add switch to code editor
- feed ValueProperty.runtime from code editor
- add switch back to standard editor

- restore error notification for expressions
- mark field with error
- mark fragment with error

+ add BoolEditor
- add FloatEditor
- add DateEditor

TODO (requires the INTERNET)
- add placeholder to editors

+ add support for keyboard in BoolEditor (spacebar, return should trigger check/uncheck)
+ make certain elements unselectable (field keys, bool editor, toolbars, footer)

- context: switch editor button
- context: switch between native editor and code editor
- model: switch editor button
- model: switch editor menu
- model: switch between any 2 editors

- move expression evaluation away from contextview
- evaluate expressions in context
- create dependency between model values and context properties
- refresh evaluation on change

- helper context (for excel like functions)

+ active state for context fields
+ focus state for context fields
- active state for model fields
- focus state for model fields

- inline fragment

- more properties:
	- text
	- visible

- bidirectional updates from property to model when possible

DOC: drag and drop fragments

MV: add support for multiple editor
MV: change value type
MV: nested data structures (objects, arrays)
MV: set focus to next field after deletion
MV: prevent field blur when moving to a context button OR highlight the currently selected context even if the caret is not there
MV: text placeholder for editors
MV: field do not propagate until they have a unique field name
MV: highlight invalid text editors

DOC: define Fragment
DOC: Fragment properties (to display in context)
DOC: create Fragment
DOC: delete Fragment
DOC: define Fragment hierarchy
DOC: display hierarchy breadcrumbs
DOC: create new blocks after the current one
DOC: set focus to currently created block/fragment

CV: current fragment/block
CV: display associated properties
CV: add related properties

OPT: execute expression in special scope with utility functions

DONE:

+ active state for fragments
+ focus state for fragments
+ make all fragments focusable
+ feed content
+ display runtime errors
+ display syntax errors
+ create tooltip
+ create error tooltip
+ locate tooltip below
+ transform expression into function
+ list available properties for block
+ display asssociated properties to block
+ add pairs for properties
+ add expression
+ restore styles
+ add simple menu
+ create placeholder for context properties
+ create placeholder for context toolbar
+ add split button for "add property"
+ create 'add block' button
+ create block as component
+ make block editable
+ on button click create a block after the last one
+ identify the currently selected block
+ create document area
+ create document toolbar
+ create document footer
+ add modelview toolbar
+ "add field" button toolbar
+ autogenerate field name
+ create new field using button
+ "remove field" button in toolbar
+ implement current field
+ disable right context buttons if no current field
+ implement modelview.removeField()
+ add field should trigger a schema change
+ remove field should trigger a schema change
+ remove field should trigger a model change
+ rename field should trigger a schema change
+ rename field should trigger a model change
+ setting a value should trigger a model change
