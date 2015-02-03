# Eventually

Promise and Observe based system to await data / objects to be assigned from external / 3rd party async javascript scripts without polling or blocking page load. Support setting timeout contract and error handling.

###install

```npm install eventually```


```javascript
var eventually = require("eventually");
```

### usage

```javascript
// In location awaiting rendering a feature dependent on the async
// arrival of a value, observe the value and handle what you expect to arrive
eventually.observe(some_object).expect("foo", function(value){
  // do something with the 'value' of foo you were waiting for
}).catch(function(status) {
  // fallback in event of timeout or handle an error
})

// Optionally set a timeout for the async delivery
eventually.observe(some_object).timeout(1000).expect....

```

### testing

``` npm test ```