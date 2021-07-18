const fs = require("fs");
const process = require("process");

// Read csv files.
let zipsRows = fs.readFileSync("./zips.csv", {encoding:'utf8'}).split("\n");
let plansRows = fs.readFileSync("./plans.csv", {encoding:'utf8'}).split("\n");
let slcspRows = fs.readFileSync("./slcsp.csv", {encoding: 'utf8'}).split("\n");

// Two helper functions:

// This finds ONE match in an ordered array.
// "key" is the name of array's property by which the array is sorted
const binarySearch = (array, target, key, iMin = 0, iMax = array.length - 1) => {
    let [xMin, xMax] = [array[iMin][key], array[iMax][key]];
    if (xMin === target) return iMin;
    if (xMax === target) return iMax;
    if (iMax - iMin < 2) return ''; // The target was not found.
    let iNext = Math.floor((iMin + iMax) / 2); // divide and conquer
    let xNext = array[iNext][key];
    if (xNext > target) {
        iMax = iNext;
    } else {
        iMin = iNext;
    }
    return binarySearch(array, target, key, iMin, iMax);  // recursive call
}

// This finds ALL matches in an ordered array.
// If this is the first search, it returns the rate-area tuple.
// If this is the second search, it returns the second-lowest cost. 
const findMatch = (array, target, key1, key2) => {
    const matches = new Set(); // use set to eliminate duplicates
    let iMatch = binarySearch(array, target, key1); // finds ONE match
    if (!iMatch) return ''; // target was not found
    let x = array[iMatch][key2];
    matches.add(key1 === 'zipcode' ? x : Number(x));
    let i = iMatch + 1;
    // include elements which have same #key1 but larger index.
    while (array[i][key1] === target) {
        x = array[i][key2];
        matches.add(key1 === 'zipcode' ? x : Number(x));
        i++;
    }
    i = iMatch - 1;
    // include elements which have same #key1 but smaller index.
    while (array[i][key1] === target) {
        x = array[i][key2];
        matches.add(key1 === 'zipcode' ? x : Number(x));
        i--;
    }
    if (key1 === 'zipcode') {
        // Ambiguity arises if a zipcode is in multiple rate-areas.
        return matches.size === 1 ? Array.from(matches)[0] : '';
    } else {
        // Second lowest cost only exists if there are at least two different rates.
        if (matches.size < 2) return '';
        // one-pass search for second-lowest cost
        let [lowest, secondLowest] = [Infinity, Infinity];
        matches.forEach(rate => {
            if (rate < lowest) {
                [lowest, secondLowest] = [rate, lowest];
            } else if (rate < secondLowest) {
                secondLowest = rate;
            }
        });
        return secondLowest;
    }
}

// one-pass (not including sorting) processing of data read from zips.csv

zipsRows = zipsRows.reduce((set, row, index) => {
    const vals = row.split(',');
    // Ignore zeroth- and empty rows
    // Consolidate columns and use a set of strings to eliminate dupes.
    if (index && row) set.add([vals[0], vals[1] + vals[4]].join(","));
    return set;
}, new Set());

// conversion from set to array of pojos in order to allow sorting
zipsRows = (Array.from(zipsRows)).map(row => {
    const vals = row.split(',');
    return {zipcode: vals[0], tuple: vals[1]};
}).sort((a, b) => a.zipcode - b.zipcode); // sorted array allows for quick lookup

// let data = zipsRows.map(row => Object.values(row).join(',')).join('\n');
// fs.writeFileSync("./zipsRows.txt", data);

// single-pass processing (not including sorting) of the data from plans.csv

plansRows = plansRows.reduce((set, row, index) => {
    const vals = row.split(',');
    // Ignore zeroth- and empty rows, and filter on 'Silver'
    // Consolidate columns and use a set of strings to eliminate dupes.
    if (index && row && vals[2] === 'Silver') set.add([vals[1] + vals[4], vals[3]].join(","));
    return set;
}, new Set());

// Convert from set to array of pojos in order to allow sorting.
plansRows = (Array.from(plansRows)).map(row => {
    const vals = row.split(',');
    return {tuple: vals[0], rate: vals[1]};
// sorted array allows for quick lookup
}).sort((a,b)=>a.tuple<b.tuple?-1:a.tuple>b.tuple?1:a.rate<b.rate?-1:a.rate>b.rate?1:0);

// data = plansRows.map(row => Object.values(row).join(',')).join('\n');
// fs.writeFileSync("./plansRows.txt", data);

// final preparation of output

let output = slcspRows[0] + "\n"; // header

slcspRows.forEach((row, index) => {
    if (index && row) { // ignore header row and empty rows
        let tuple = findMatch(zipsRows, row.slice(0, -1), 'zipcode', 'tuple'); // find rate-area
        let secondLowestRate = tuple && findMatch(plansRows, tuple, 'tuple', 'rate');
        output += row + (secondLowestRate && secondLowestRate.toFixed(2)) + "\n";
    }
});

fs.writeFileSync("./slcspOUT.csv", output); // write to file
process.stdout.write(output); // write to terminal
