const fs = require("fs");

fs.readFile("zips.csv", "utf8", (err, data) => {
    if (err) console.log(err);
//   console.log("THE CONTENTS ARE:");
//   console.log(data);
    let rows = data.split("\n");
    const headers = rows[0].split(',');
    rows = rows.slice(1).filter(row => !!row).map(row => {
        const vals = row.split(',');
        row = headers.reduce((pojo, header, index) => {
            return {...pojo, [header]: vals[index]};
        }, {});
        return {...row, tuple: row.state + row.rate_area};
    }).sort((a, b) => Number(a.zipcode) - Number(b.zipcode));
    console.log(rows);
});
