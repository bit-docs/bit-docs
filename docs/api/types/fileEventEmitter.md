@parent bit-docs/types
@typedef {{on: function(String), cwd: String}} bit-docs/types/FileEventEmitter FileEventEmitter

[Node.js EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)
that emits an event with [bit-docs/types/fileSource] for every file found.

@option {String} cwd The root directory where "match" events are relative to.

@option {function} on(event, listener)

Registers an event listener.  File event emitters should dispatch:

 - `"match"` events that call listener with the matched path.
 - `"end"` events that call listener when there are no more matches.
