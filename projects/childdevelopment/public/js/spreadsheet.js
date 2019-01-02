function Spreadsheet(spreadsheetID, data) {
    this.update = update;
    // detect page layout
    const width = window.innerWidth * 0.4 - 21 - 20;
    const height = window.innerHeight - 152 - 20;

    let element = document.getElementById(spreadsheetID);

    let setting = {
        data: data,
        stretchH: 'all',
        width: width * 0.9,
        height: height * 0.9,
        colHeaders: Object.keys(data[0]),
        fixedColumnsLeft: 1
    };
    let csvContent = "data:text/csv;charset=utf-8,";
    let titles = Object.keys(data[0]).join(",");
    csvContent += titles + "\r\n";
    data.forEach(function (rowArray) {
        let row = Object.values(rowArray).join(",");
        csvContent += row + "\r\n";
    });
    window.encodedUri = encodeURI(csvContent);

    let table = new Handsontable(element, setting);
    let downloadButton = d3.select("#chart-download").append("button")
        .text(function () {
            if (data.length <= 10) {
                return "Download Data";
            } else {
                return "Download Data (all " + String(data.length) + " data entries)";
            }
        })
        .style("position", "absolute")
        .style("bottom", "30px")
        .style("right", "16px")
        .on("click", function () {
            location.href = window.encodedUri;
        });
    let dataAoA = data.map(d => d["AoA"]);
    let sum, avg = 0;
    if (dataAoA.length) {
        sum = dataAoA.reduce(function (a, b) {
            return Number(a) + Number(b);
        });
        avg = Math.round(sum / dataAoA.length * 100) / 100;
    }

    d3.select("#chart-download").append("text")
        .attr("id", "count-AoA-label")
        .attr("class", "dosis teal-text")
        .text("The average age of selected words is: " + avg)
        .style("position", "absolute")
        .style("bottom", "50px")
        .style("left", "32px");

    function update(updatedData) {
        table.loadData(updatedData);
        let csvContent = "data:text/csv;charset=utf-8,";
        let titles = ['word', 'percentage_known', 'Prevalence', 'concreteness', 'AoA', 'valence', 'arousal', 'dominance'].join(",");
        csvContent += titles + "\r\n";
        updatedData.forEach(function (rowArray) {
            let row = Object.values(rowArray).join(",");
            csvContent += row + "\r\n";
        });
        window.encodedUri = encodeURI(csvContent);
        downloadButton.text(function () {
            if (updatedData.length <= 10) {
                return "Download Data";
            } else {
                return "Download Data (all " + String(updatedData.length) + " data entries)";
            }
        });
        let dataAoA = updatedData.map(d => d["AoA"]);
        let sum, avg = 0;
        if (dataAoA.length) {
            sum = dataAoA.reduce(function (a, b) {
                return Number(a) + Number(b);
            });
            avg = Math.round(sum / dataAoA.length * 100) / 100;
        }
        d3.select("#count-AoA-label")
            .text("The average age of selected words is: " + avg)
    }
}
