importScripts("./lib/core.min.js");
importScripts("./lib/md5.min.js");
importScripts("./lib/umd.js");
importScripts("./bsn.js");

onmessage = e => {
  const msg = e.data;
  switch(msg.type) {
    case 'generate':
      const [start, finish] = msg.value;
      console.log(`🧑🏽‍🏭 Started generating from ${start} to ${finish}`);
      generate(start, finish);
      break;
  }
}

async function generate(min, max) {
  min = 1 * min;
  max = 1 * max;
  const storeName = 'BSNs';
  const db = await idb.openDB('BSN Generator', 3, {
    upgrade(db) {
      db.createObjectStore(storeName);
    },
  });

  // Do this many BSNs in one go
  const chunkSize = 10000;

  for ( let i = min; i <= max; i += chunkSize ) {
    // Generate this chunk
    const last = i + chunkSize - 1;
    const tempdb = generateBSNs(i, last > max ? max : last)
                   .map(bsn => [CryptoJS.MD5(bsn).toString(), bsn]);
    // Did we find anything?
    if ( tempdb.length == 0 ) continue;
    // Store it in IndexedDB
    const tx = db.transaction(storeName, 'readwrite');
    await Promise.all([
      ...tempdb.map(([hash, bsn]) => tx.store.put(bsn, hash)),
      tx.done
    ]);
    // Notify the webpage
    postMessage({
      type: 'progress',
      value: {
        progress: i,
        last: tempdb.pop()
      }
    });
  }

  // And we're done!
  postMessage({
    type: 'done'
  })
}
