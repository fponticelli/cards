import { Schema } from 'ui/schema';

let assert = require("assert"),
    should = require("should");


describe('Schema', function(){
  it('should pass all the basics', function(){
    let schema = new Schema();
    assert.deepEqual([], schema.array);
    assert.ok(!schema.get("test"));

    schema.add("test", 'String');
  });

  it('should stream the changes', function(done) {
    let expect = [
          { event:'list', data:[] },
          { event:'add', name:'test', type:'String' },
          { event:'rename', oldname:'test', newname:'number' },
          { event:'retype', name:'number', type:'Number' },
          { event:'delete', name:'number' }
        ],
        schema = new Schema();
    schema.stream.subscribe((t) => {
      assert.deepEqual(expect.shift(), t);
      if(expect.length === 0)
        done();
    });

    schema.add("test", 'String');
    schema.rename("test", "number");
    schema.retype("number", 'Number');
    schema.delete('number');
  });
});