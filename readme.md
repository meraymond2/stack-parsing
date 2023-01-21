# stack-parsing

An experiment in writing a top-down parser that uses an explicit stack rather than recursive function calls.

So far I've written a basic JSON parser, but would like to try some others too.

## Status
It's working, but it's horrendously slow at the moment, at least on the large file I'm testing on. It's averaging 104ms per loop! and takes over 7 minutes, whereas JSON.parse + JSON.stringify takes 5 seconds.

My untested hypothesis is that it's the `concat` in the parser. For objects and arrays I'm creating copies but not using the previous version, so that can be done mutably and probably bring the time down.

It won't get as fast as JSON.parse, but I think it should get within an order of magnitude at least.
