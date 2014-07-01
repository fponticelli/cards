- move expression evaluation away from contextview
- evaluate expressions in context
- create dependency between model values and context properties
- refresh evaluation on change

- helper context (for excel like functions)

- active state for fields
- focus state for fields

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
