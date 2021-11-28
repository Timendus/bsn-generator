# BSN Generator

This website can generate all possible BSN numbers (Dutch citizen service
numbers) and creates a lookup table from MD5 hash back to BSN.

## Why did I make this?

This website is intended to be a warning.

There are people who think that data can be anonymised or pseudonymised by
hashing citizen service numbers. Because a hash function only works in one
direction. So those original numbers are then impossible to retrieve, right?

However, the Dutch BSN conforms to a [simple mathematical formula](https://nl.wikipedia.org/wiki/Burgerservicenummer#11-proef),
and only 90.909.090 combinations are possible. So we can just generate all of
them. And once we have generated the lot, we can hash them. This way we can
quite easily create a lookup table back from hashes to citizen service numbers.
This website does that using MD5, but obviously the same holds equally for any
other hashing algorithm.

So NEVER EVER use a hashed citizen service number (BSN or otherwise) as an index
for an "anonymous" dataset!

## Legal stuff

It may be obvious that this website can also be used for evil **if** someone has
been dumb enough to "secure" a dataset with MD5 hashes of BSNs. I do not condone
such usage of this website.

Also, be warned that usage of this website is possibly a violation of Dutch law,
which prohibits the processing of BSN numbers without a legal ground for doing
so. I'm not sure if this also goes for just the numbers without any personally
identifiable information.

Use at your own risk.

All the BSNs are generated client side in the webbrowser, and are not sent to or
processed by any server.

## Nerdy stuff

The BSN generation, MD5 hashing and storing the result is done in a web worker
to keep the main thread responsive. The web worker stores all results in a store
in IndexedDB, which can at the same time be searched through using the search
form on the main thread. No need to wait for the generation to be finished,
which is kinda cool.

If you try to actually generate a significant range of possible BSNs, you'll
discover that it takes much longer than you might reasonably expect. Most of
that is in writing the results to IndexedDB. At first I kept all results in
memory, which was much faster. But browsers don't like it when you try to keep
several Gigabytes of data in a single object in a web worker, so that crashed if
you tried to generate too big a range.

I'd rather have an unlimited demo that is slow than a limited one that is fast,
especially when I don't really know the limits and have no way of detecting when
I run into them. And to be honest, I don't mind it being so slow for large
ranges. It is plenty fast enough to demo the mechanism on a smaller subset, and
this keeps bad guys from actually being able to effectively use it 😉
