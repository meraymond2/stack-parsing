# stack-parsing

An experiment in writing a top-down parser that uses an explicit stack rather than recursive function calls.

So far I've written a basic JSON parser, but would like to try some others too.

## Status
It's mostly working. To build up the objects and arrays, I was originally using `concat`, but it was terribly slow. On my 181 MB test file, it took over 7 minutes, whereas JSON.parse + JSON.stringify took 5 seconds.

Since I didn't need the immutability there — the previous versions of those states weren't used — I changed it to use `push`. Counter-intuitively, this caused memory leaks and it would fall over with a `Javascript heap out of memory`. If anything I would have expected the concat version to run out of memory, not the one that mutates in place.

But it works if you run it with `node --max-old-space-size=4096 out/index.js`, and the performance is closer to what I'd hope for. That version ran in around 15-19 seconds.
