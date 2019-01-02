function TileChart() {
    this.update = update
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var legendSvg = d3.select("#legend")
        .append("svg")
        .attr("width", w * 0.7)
        .attr("height", w / 12 * 0.7);
    var tilesSvg = d3.select("#tiles")
        .append("svg")
        .attr("width", w * 0.7)
        .attr("height", w * 0.7 * 0.7);
    const states = [["AK", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "ME"],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "VT", "NH"],
        [0, "WA", "ID", "MT", "ND", "MN", "IL", "WI", "MI", "NY", "RI", "MA"],
        [0, "OR", "NV", "WY", "SD", "IA", "IN", "OH", "PA", "NJ", "CT", 0],
        [0, "CA", "UT", "CO", "NE", "MO", "KY", "WV", "VA", "MD", "DC", 0],
        [0, 0, "AZ", "NM", "KS", "AR", "TN", "NC", "SC", "DE", 0, 0],
        [0, 0, 0, 0, "OK", "LA", "MS", "AL", "GA", 0, 0, 0],
        [0, "HI", 0, 0, "TX", 0, 0, 0, 0, "FL", 0, 0]];
    const perc_regex = /\d+.\d/;
    var tooltip = d3.select("#tiles")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function update(data, colorScale) {
        //Draw legend boxes based on colorScale
        let legendBox = legendSvg.selectAll(".legend_box")
            .data(colorScale.range());
        legendBox.enter()
            .append("rect")
            .merge(legendBox)
            .attr("class", "legend_box")
            .attr("x", function (d, i) {
                return i * w / 18 + w / 18 * 0.3;
            })
            .attr("y", w / 12 * 0.15)
            .attr("width", w / 18)
            .attr("height", w / 12 * 0.07)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .attr("fill", function (d) {
                return d;
            });
        legendBox
            .exit()
            .remove();
        //Draw labels for the legend
        let labels = legendSvg.selectAll(".label")
            .data(colorScale.domain());
        labels.enter()
            .append("text")
            .merge(labels)
            .attr("class", "label")
            .attr("dx", function (d, i) {
                return i * w / 18 + w / 18 * 0.3;
            })
            .attr("dy", w / 12 * 0.5)
            .text(function (d) {
                return d
            })
            .attr("text-anchor", "start")
            .attr("font-family", "Roman")
            .attr("font-size", "12px")
            .attr("fill", "black")
        labels
            .exit()
            .remove();
        //Draw rectangles of states
        let boxes = tilesSvg.selectAll(".boxes")
            .data(data);
        boxes.enter()
            .append("rect")
            .merge(boxes)
            .attr("class", "boxes")
            .attr("x", function (d) {
                return getIndexOfK(states, d.Abbreviation)[1]
                    * (w / 18);
            })
            .attr("y", function (d) {
                return getIndexOfK(states, d.Abbreviation)[0]
                    * (w * 0.7 / 18);
            })
            .attr("width", w / 19)
            .attr("height", w / 19 * 0.7)
            .attr("fill", function (d) {
                var perTr = +d["R_Percentage"].match(perc_regex);
                var perCl = +d["D_Percentage"].match(perc_regex);
                var diff = +perTr - +perCl;
                return colorScale(+diff);
            })
            .on("mouseover", function (d) {
                tooltip.html(
                    "<strong>" + d["State"] +
                    "</strong><br><br>Electoral Votes: "
                    + d.Total_EV +
                    "<br>" + d.D_Nominee + ": "
                    + d.D_Votes + " ("
                    + d.D_Percentage +
                    ")<br>" + d.R_Nominee + ": "
                    + d.R_Votes + " ("
                    + d.R_Percentage + ")"
                )

                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .style("opacity", .9);
            })
            .on("mouseout", function (d) {
                tooltip.style("opacity", 0);
            })
        boxes
            .exit()
            .remove();


        //Draw names of states
        let stateLabels = tilesSvg.selectAll(".stateName")
            .data(data);
        stateLabels.enter()
            .append("text")
            .merge(stateLabels)
            .attr("class", "stateName")
            .text(function (d) {
                return (d.Abbreviation +
                    "\r\n" + d.Total_EV);
            })
            .attr("text-anchor", "middle")
            .attr("x", function (d) {
                return getIndexOfK(states, d.Abbreviation)[1]
                    * (w / 18) + w / 19 / 2;
            })
            .attr("y", function (d) {
                return getIndexOfK(states, d.Abbreviation)[0]
                    * (w * 0.7 / 18)
                    + w / 19 * 0.7 / 2;
            })
            .attr("font-family", "Roman")
            .attr("font-size", "10px")
            .attr("fill", "black");
        stateLabels
            .exit()
            .remove();
    }

    function getIndexOfK(arr, k) {
        for (var i = 0; i < arr.length; i++) {
            var index = arr[i].indexOf(k);
            if (index > -1) {
                return [i, index];
            }
        }
    }
}

