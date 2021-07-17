const fs = require("fs");

const binarySearch = (array, target, key, iMin = 0, iMax = array.length - 1) => {
    let xMin = array[iMin][key];
    let xMax = array[iMax][key];
    if (xMin === target) return iMin;
    if (xMax === target) return iMax;
    if (iMax - iMin < 2) return null;
    let iNext = Math.floor((iMin + iMax) / 2);
    let xNext = array[iNext][key];
    if (xNext > target) {
        iMax = iNext;
    } else {
        iMin = iNext;
    }
    // console.log(iNext, array[iNext][key]);
    return binarySearch(array, target, key, iMin, iMax);
}

const findMatches = (array, target, key1, key2) => {
    const matches = new Set();
    let iMatch = binarySearch(array, target, key1);
    if (iMatch === null) return [];
    matches.add(array[iMatch][key2]);
    let i = iMatch + 1;
    let n = 1;
    while (array[i][key1] === target) {
        matches.add(array[i][key2]);
        i++;
        n++;
    }
    i = iMatch - 1;
    while (array[i][key1] === target) {
        matches.add(array[i][key2]);
        i--;
        n++;
    }
    let returnArray = Array.from(matches);
    if (key2 === "rate") returnArray.sort((a, b) => Number(a) - Number(b));
    return returnArray;
}

let zipsRows = fs.readFileSync("./zips.csv", {encoding:'utf8', flag:'r'}).split("\n");

zipsRows = zipsRows.reduce((set, row, index) => {
    const vals = row.split(',');
    if (index && row) set.add([vals[0], vals[1] + vals[4]].join(","));
    return set;
}, new Set());

zipsRows = (Array.from(zipsRows)).map(row => {
    const vals = row.split(',');
    return {zipcode: vals[0], tuple: vals[1]};
}).sort((a, b) => a.zipcode - b.zipcode);

let data = zipsRows.map(row => row.zipcode + ',' + row.tuple);
fs.writeFileSync("./zipsRows.txt", data.join("\n"));

let plansRows = fs.readFileSync("./plans.csv", {encoding:'utf8', flag:'r'}).split("\n");

plansRows = plansRows.reduce((set, row, index) => {
    const vals = row.split(',');
    if (index && row && vals[2] === 'Silver') set.add([vals[1] + vals[4], vals[3]].join(","));
    return set;
}, new Set());

plansRows = (Array.from(plansRows)).map(row => {
    const vals = row.split(',');
    return {tuple: vals[0], rate: vals[1]};
}).sort((a, b) => a.tuple < b.tuple ? -1 : a.tuple > b.tuple ? 1 : a.rate < b.rate ? -1 : a.rate > b.rate ? 1 : 0);

data = plansRows.map(row => row.tuple + ',' + row.rate);
fs.writeFileSync("./plansRows", data.join("\n"));

let slcspRows = fs.readFileSync("./slcsp.csv", {encoding: 'utf8', flag: 'r'}).split("\n");
headers = slcspRows[0].split(',');

slcspRows = slcspRows.slice(1).filter(row => !!row).map((row, index) => {
    // if (!index) {
    let zipcode = row.slice(0, -1);
    let tuples = findMatches(zipsRows, zipcode, 'zipcode', 'tuple');
//     // if there are multiple tuples for that zipcode, break
    let rates = findMatches(plansRows, tuples[0], 'tuple', 'rate');
    if (!rates.length) {
        console.log(zipcode, []);
    } else if (rates.length === 1) {
        console.log(zipcode, ',');
    } else {
        console.log(zipcode, rates[1]);
    }

//     // binary search for tuple in plansRows
//     // assemble all elements in plansRows for that rateArea
//     // put those elements into a set, to eliminate dupes
//     // if the set has a single element, break
//     // loop over set, taking 2nd-smallest value
    // }
});
