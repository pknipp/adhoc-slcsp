const fs = require("fs");

let zipsRows = fs.readFileSync("./zips.csv", {encoding:'utf8', flag:'r'}).split("\n");
const headers = zipsRows[0].split(',');
zipsRows = zipsRows.slice(1).filter(row => !!row).map(row => {
    const vals = row.split(',');
    row = headers.reduce((pojo, header, index) => {
        return {...pojo, [header]: vals[index]};
    }, {});
    return {...row, tuple: row.state + row.rate_area};
}).sort((a, b) => a.zipcode - b.zipcode);

