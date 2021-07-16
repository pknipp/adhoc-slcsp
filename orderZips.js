const fs = require("fs");

const binarySearch = (array, target, key, iMin = 0, iMax = array.length - 1) => {
    let xMin = array[iMin][key];
    let xMax = array[iMax][key];
    if (xMin === target) return iMin;
    if (xMax === target) return iMax;
    if (iMax - iMin < 2) return NaN;
    let iNext = Math.floor((iMin + iMax) / 2);
    let xNext = array[iNext][key];
    if (xNext > target) {
        iMax = iNext;
    } else {
        iMin = iNext;
    }
    return binarySearch(array, target, key, iMin, iMax);
}

const findMatches = (array, target, key1, key2) => {
    const matches = new Set();
    let iMatch = binarySearch(array, target, key1);
    matches.add(array[iMatch][key2]);
    let i = iMatch + 1;
    let n = 1;
    while (array[i] === target) {
        matches.add(array[i][key2]);
        i++;
        n++;
    }
    i = iMatch - 1;
    while (array[i] === target) {
        matches.add(array[i][key2]);
        i--;
        n++;
    }
    return [matches, n];
}

let zipsRows = fs.readFileSync("./zips.csv", {encoding:'utf8', flag:'r'}).split("\n");
zipsRows = zipsRows.slice(1).filter(row => !!row).reduce((set, row) => {
    const vals = row.split(',');
    set.add([vals[0], vals[1] + vals[4]].join(","));
    return set;
}, new Set());
zipsRows = (Array.from(zipsRows)).map(row => {
    const vals = row.split(',');
    return {zipcode: vals[0], tuple: vals[1]};
}).sort((a, b) => a.zipcode - b.zipcode);

let plansRows = fs.readFileSync("./plans.csv", {encoding:'utf8', flag:'r'}).split("\n");
plansRows = plansRows.slice(1).filter(row => !!row).reduce((set, row) => {
    const vals = row.split(',');
    if (vals[2] === 'Silver') set.add([vals[1] + vals[4], vals[3]].join(","));
    return set;
}, new Set());
plansRows = (Array.from(plansRows)).map(row => {
    const vals = row.split(',');
    return {tuple: vals[0], rate: vals[1]};
}).sort((a, b) => a.tuple < b.tuple ? -1 : a.tuple > b.tuple ? 1 : 0);

let slcspRows = fs.readFileSync("./slcsp.csv", {encoding: 'utf8', flag: 'r'}).split("\n");
headers = slcspRows[0].split(',');

slcspRows = slcspRows.slice(1).filter(row => !!row).map(row => {
    let zip = row.slice(0, -1);
    let matches = findMatches(zipsRows, zip, 'zipcode', 'tuple');
    // console.log(zip, matches);
//     // if there are multiple tuples for that zip, break
//     // binary search for tuple in plansRows
//     // assemble all elements in plansRows for that rateArea
//     // put those elements into a set, to eliminate dupes
//     // if the set has a single element, break
//     // loop over set, taking 2nd-smallest value
});
