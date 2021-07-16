const fs = require("fs");

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
plansRows = plansRows.slice(1).reduce((rows, row) => {
    const vals = row.split(',');
    if (vals[metalHeaderIndex] === 'Silver') {
        row = headers.reduce((pojo, header, index) => {
            return {...pojo, [header]: vals[index]};
        }, {});
        rows = [...rows, {...row, tuple: row.state + row.rate_area}];
    }
    return rows;
}, []).sort((a, b) => a.tuple < b.tuple ? -1 : a.tuple > b.tuple ? 1 : 0);
