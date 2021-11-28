// Genereer alle mogelijke BSNs in het gegeven interval (inclusive)
function generateBSNs(min, max) {
  const tempdb = [];
  for ( let bsn = min; bsn <= max; bsn++ ) {
    if ( !BSNElfproef(bsn) ) continue;
    // The number is a valid BSN, store it
    tempdb.push(toBSN(bsn));
    // If an 8-digit version is possible too, add it as well
    if ( bsn < 100000000 ) tempdb.push(toBSN(bsn, 8));
  }
  return tempdb;
}

// BSNs kunnen leading zeros hebben, en zijn dus eigenlijk geen integers maar
// strings. Behandel ze als zodanig.
function toBSN(number, digits = 9) {
  return `${number}`.padStart(digits, '0');
}

// Bij de elfproef worden de afzonderlijke cijfers "gewogen" bij elkaar
// opgeteld, dat wil zeggen afhankelijk van de positie van het cijfer wordt het
// met een afgesproken getal (gewicht) vermenigvuldigd. Voor geldige nummers
// moet de som van de resultaten een veelvoud van 11 zijn. De gewichten zijn
// voor BSN nummers de positie van het cijfer, geteld vanaf rechts. Het meest
// rechter getal wordt met -1 vermenigvuldigd in plaats van met 1. 000000000 is
// geen geldig BSN.
function BSNElfproef(bsn) {
  bsn = 1 * bsn;
  let acc = 0;
  for ( let i = 1; i < 10; i++ ) {
    const digit = Math.floor((bsn / Math.pow(10, i - 1)) % 10);
    if ( i == 1 )
      acc += -1 * digit;
    else
      acc += i * digit;
  }
  return acc != 0 && acc % 11 == 0;
}
