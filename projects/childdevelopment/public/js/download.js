function DownloadChart(data) {
    //Select general graph div
    const chartDiv = d3.select("#chart-download");

    //Segment page for graphics
    const distributionChartDiv = chartDiv.append("div")
        .attr("id", "distribution-chart-div")
        .style("position", "absolute")
        .style("left", "16px")
        .style("top", 0)
        .style("width", window.innerWidth * 0.6 - 21 + "px")
        .style("height", window.innerHeight - 152 + "px");
    const spreadsheetChartDiv = chartDiv.append("div")
        .attr("id", "spreadsheet-chart-div")
        .style("position", "absolute")
        .style("right", "16px")
        .style("top", 0)
        .style("width", window.innerWidth * 0.4 - 21 + "px")
        .style("height", window.innerHeight - 152 + "px");
    let spreadsheet = new Spreadsheet("spreadsheet-chart-div", data[0]);
    //Set up graph anchors
    const boxChartMargin = {
        top: 60,
        bottom: 60,
        left: 30,
        right: 0
    };
    const boxChartHeight = window.innerHeight * 0.8 - 152 - boxChartMargin.top - boxChartMargin.bottom;
    const boxChartWidth = Math.min((window.innerWidth * 0.7 - 21 - boxChartMargin.left - boxChartMargin.right),
        window.innerWidth * 0.6 - 21);

    //Set up svg panel
    const distributionChartSvg = distributionChartDiv.append("svg")
        .attr("width", boxChartWidth + boxChartMargin.left + boxChartMargin.right)
        .attr("height", boxChartHeight + boxChartMargin.top + boxChartMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + boxChartMargin.left + "," + boxChartMargin.top + ")")
        .attr("id", "distribution-chart-svg");

    //Data categories
    const categories = ["AoA", "Prevalence", "arousal", "concreteness", "dominance", "valence"];
    const brushes = {};
    const yScales = {};
    let boxScales = [],
        boxWidth = 50,
        axisPosScale = d3.scaleBand()
            .range([0, boxChartWidth])
            .domain(categories),
        yScale = d3.scaleLinear()
            .range([boxChartHeight, 0]);

    let boxElements = distributionChartSvg
        .selectAll(".box-element")
        .data(categories)
        .enter()
        .append("g")
        .attr("class", "box-element")
        .attr("transform", function (d) {
            return "translate(" + axisPosScale(d) + ",0)";
        });

    // Add axis and title.
    boxElements.append("g")
        .attr("class", "box-element")
        .attr("id", function (d) {
            return "brush" + d
        })
        .each(function (d) {
            let categoryData = data[0].map(x => x[d]).sort(function (a, b) {
                return a - b
            });
            let labelScale = d3.scaleLinear()
                .range([boxChartHeight, 0])
                .domain([categoryData[0], categoryData[categoryData.length - 1]]);
            yScales[d] = labelScale;
            //Calculate box scale
            let quantileScale = d3.scaleQuantile()
                .range(categoryData)
                .domain(d3.range(5));
            d3.select(this).call(d3.axisLeft().scale(labelScale));

            //Draw dash lines
            d3.select(this).append("path").datum([
                [boxWidth, labelScale(categoryData[0])],
                [boxWidth, labelScale(categoryData[categoryData.length - 1])]
            ])
                .attr("d", d3.line())
                .style("stroke", "black")
                .style("stroke-dasharray", "4, 10");

            //Draw box
            d3.select(this).append("rect")
                .attr("x", boxWidth / 2)
                .attr("y", labelScale(quantileScale(3)))
                .attr("height", labelScale(quantileScale(2)) - labelScale(quantileScale(3)))
                .attr("width", boxWidth)
                .attr("fill", "#7BB9D1")
                .attr("stroke", "black");
            d3.select(this).append("rect")
                .attr("x", boxWidth / 2)
                .attr("y", labelScale(quantileScale(2)))
                .attr("height", labelScale(quantileScale(1)) - labelScale(quantileScale(2)))
                .attr("width", boxWidth)
                .attr("fill", "#0A5572")
                .attr("stroke", "black");

            //Draw horizontal lines
            d3.select(this).append("line")
                .attr("x1", boxWidth / 2)
                .attr("x2", boxWidth * 1.5)
                .attr("y1", labelScale(quantileScale(0)))
                .attr("y2", labelScale(quantileScale(0)))
                .attr("stroke", "black");
            d3.select(this).append("line")
                .attr("x1", boxWidth / 2)
                .attr("x2", boxWidth * 1.5)
                .attr("y1", labelScale(quantileScale(4)))
                .attr("y2", labelScale(quantileScale(4)))
                .attr("stroke", "black");

            //Add brush
            brushes[d] = d3.select(this).call(d3.brushY()
                .extent([[0, 0], [boxWidth * 2, boxChartHeight]])
                .on("start brush end", brushMoved));
            brushes[d].call(d3.brushY().move, [0, boxChartHeight]);
            let handle = d3.select(this).selectAll(".handle--custom")
                .data([{type: "n"}, {type: "s"}])
                .enter().append("path")
                .attr("class", "handle--custom")
                .attr("id", function (i) {
                    return "handle-" + d + "-" + i["type"];
                })
                .attr("fill", "#2F7F9E")
                .attr("fill-opacity", 0.8)
                .attr("stroke", "#2F7F9E")
                .attr("stroke-width", 1.5)
                .attr("cursor", "ns-resize")
                .attr("transform", function (i) {
                    if (i["type"] === "n") {
                        return "translate(" + boxWidth + ",0)";
                    } else if (i["type"] === "s") {
                        return "translate(" + boxWidth + "," + boxChartHeight + ")";
                    }
                })
                .attr("d", function (d, i) {
                    let upperPath = "M " + -boxWidth + " 0 L 0 10 L" + boxWidth + " 0 Z";
                    let lowerPath = "M " + -boxWidth + " 0 L 0 -10 L" + boxWidth + " 0 Z";
                    return i ? upperPath : lowerPath;
                });
        })
        .append("text")
        .style("text-anchor", "middle")
        .style("font-size", "18px")
        .attr("y", -25)
        .attr("x", boxWidth)
        .attr("fill", "black")
        .attr("class", "dosis purple-text")
        .text(function (d) {
            return d.charAt(0).toUpperCase()+d.substring(1);
        });

    //Add color instruction
    let colorInstructSvg = distributionChartDiv.append("svg")
        .attr("width", boxChartWidth + boxChartMargin.left + boxChartMargin.right)
        .attr("height", window.innerHeight - boxChartHeight - 144 - boxChartMargin.top - boxChartMargin.bottom)
        .style("position", "absolute")
        .style("bottom", 0)
        .style("left", 0);

    colorInstructSvg.append("rect")
        .attr("x", 16)
        .attr("y", 10)
        .attr("height", 20)
        .attr("width", 100)
        .attr("fill", "#7BB9D1")
        .attr("stroke", "black");
    colorInstructSvg.append("rect")
        .attr("x", 16)
        .attr("y", 40)
        .attr("height", 20)
        .attr("width", 100)
        .attr("fill", "#0A5572")
        .attr("stroke", "black");
    colorInstructSvg.append("text")
        .attr("x", 130)
        .attr("y", 25)
        .attr("fill", "black")
        .attr("class", "dosis purple-text")
        .text("Top 25% to Top 50%");
    colorInstructSvg.append("text")
        .attr("x", 130)
        .attr("y", 55)
        .attr("fill", "black")
        .attr("class", "dosis purple-text")
        .text("Bottom 25% to Bottom 50%");
    colorInstructSvg.append("text")
        .attr("x", 16)
        .attr("y", 85)
        .attr("fill", "black")
        .attr("class", "dosis purple-text")
        .text("Drag to select attribute range");


    function brushMoved() {
        let extents = categories.map(function (p) {
            let e = d3.select("#brush" + p)._groups[0][0];
            return d3.brushSelection(e);
        });

        categories.forEach(function (p, i) {
            d3.select("#handle-" + p + "-n")
                .attr("transform", "translate(" + boxWidth + "," + extents[i][0] + ")");
            d3.select("#handle-" + p + "-s")
                .attr("transform", "translate(" + boxWidth + "," + extents[i][1] + ")");
        });

        let selectedWords = data[0].filter(function (d) {
            let selected = categories.every(function (p, i) {
                return extents[i][0] <= yScales[p](d[p]) && yScales[p](d[p]) <= extents[i][1];
            }) ? null : "none";
            return !selected;
        });
        spreadsheet.update(selectedWords);
    }
}
