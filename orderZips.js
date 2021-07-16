const fs = require("fs");

const binarySearch = (array, target, key1, key2, iMin = 0, iMax = array.length - 1) => {
    let xMin = array[iMin][key1];
    let xMax = array[iMax][key1];
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

let zipsRows = fs.readFileSync("./zips.csv", {encoding:'utf8', flag:'r'}).split("\n");
let headers = zipsRows[0].split(',');
zipsRows = zipsRows.slice(1).filter(row => !!row).map(row => {
    const vals = row.split(',');
    row = headers.reduce((pojo, header, index) => {
        return {...pojo, [header]: vals[index]};
    }, {});
    return {...row, tuple: row.state + row.rate_area};
}).sort((a, b) => a.zipcode - b.zipcode);

let plansRows = fs.readFileSync("./plans.csv", {encoding:'utf8', flag:'r'}).split("\n");
headers = plansRows[0].split(',');
metalHeaderIndex = headers.indexOf('metal_level');
plansRows = plansRows.slice(1).filter(row => !!row).reduce((rows, row) => {
    const vals = row.split(',');
    if (vals[metalHeaderIndex] === 'Silver') {
        row = headers.reduce((pojo, header, index) => {
            return {...pojo, [header]: vals[index]};
        }, {});
        rows = [...rows, {...row, tuple: row.state + row.rate_area}];
    }
    return rows;
}, []).sort((a, b) => a.tuple < b.tuple ? -1 : a.tuple > b.tuple ? 1 : 0);

let slcspRows = fs.readFileSync("./slcsp.csv", {encoding: 'utf8', flag: 'r'}).split("\n");
headers = slcspRows[0].split(',');

slcspRows = slcspRows.slice(1).filter(row => !!row).map(row => {
    let zip = row.slice(0, -1);
//     // binary search for zip in zipsRows
//     // if there are multiple tuples for that zip, break
//     // binary search for tuple in plansRows
//     // assemble all elements in plansRows for that rateArea
//     // put those elements into a set, to eliminate dupes
//     // if the set has a single element, break
//     // loop over set, taking 2nd-smallest value
});
