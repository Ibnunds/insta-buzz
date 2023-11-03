const fs = require("fs");

const reportIG = (data, type) => {
  // Menyimpan objek JSON ke dalam file report.json
  const path = "./report";
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    buatReport(data, type);
  } else {
    buatReport(data, type);
  }
};

function buatReport(data, type) {
  const date = new Date().toISOString();
  fs.writeFile(
    `./report/report-${type}-${date}.json`,
    JSON.stringify(data, null, 4),
    (err) => {
      if (err) {
        console.error(
          "Terjadi kesalahan dalam menulis report IG Auto Post",
          err
        );
      } else {
        console.log("Sukses menulis report IG Auto Post");
      }
    }
  );
}

module.exports = reportIG;
