import { Model } from 'ui/model';
import { StringValue, NumberValue } from 'streamy/value';

let assert = require("assert"),
    should = require("should");


describe('Model', function(){
  it('should pass all the basics', function(){
    let model = new Model();
    assert.deepEqual([], model.array);
    assert.ok(!model.get("test"));

    model.add("test", new StringValue());
  });

  it('should stream the changes', function(done) {
    let expect = [
          { event:'list', data:[] },
          { event:'add', name:'test', type:'String' },
          { event:'rename', oldname:'test', newname:'number' },
          { event:'retype', name:'number', type:'Number' },
          { event:'delete', name:'number' }
        ],
        model = new Model();
    model.stream.subscribe((t) => {
      assert.deepEqual(expect.shift(), t);
      if(expect.length === 0)
        done();
    });

    model.add("test", new StringValue());
    model.rename("test", "number");
    model.retype("number", new NumberValue());
    model.delete('number');
  });
});