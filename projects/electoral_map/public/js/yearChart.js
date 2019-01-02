function YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners) {
    //Set up indexes
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    let circle_radius = w / electionWinners.length * 0.15;
    const timelineX = d3.scaleLinear()
        .domain([0, 19])
        .range([circle_radius * 3, w * 0.9 - circle_radius * 3]);
    this.update = update

    //Domain definition for global color scale
    var domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

    //Color range for global color scale
    var range = ["#0066CC", "#0080FF", "#3399FF", "#66B2FF", "#99ccff", "#CCE5FF", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#FF0000", "#CC0000"];

    //Global colorScale to be used consistently by all the charts
    self.colorScale = d3.scaleQuantile()
        .domain(domain).range(range);

    function update() {
        window.clicked = 0;
        //Set up svg paint board
        var timelineSvg = d3.select("#year-chart")
            .append("svg")
            .attr("width", w)
            .attr("height", circle_radius * 6);

        //Set up year axis
        timelineSvg.append("line")
            .attr("x1", 0)
            .attr("y1", circle_radius * 2)
            .attr("x2", w * 0.9)
            .attr("y2", circle_radius * 2)
            .attr("stroke", "gray")
            .attr("stroke-dasharray", "5, 5")
            .attr("stroke-width", "2px");

        //Set up initial circles
        timelineSvg.selectAll(".circle")
            .data(electionWinners, function (d) {
                return d.YEAR;
            })
            .enter()
            .append("circle")
            .attr("class", "year_circles")
            .attr("cx", function (d, i) {
                return timelineX(i);
            })
            .attr("cy", circle_radius * 2)
            .attr("r", function (d, i) {
                if (i === window.clicked) {
                    return 2 * circle_radius
                }
                return circle_radius
            })
            .attr("fill", function (d) {
                if (d.PARTY === "D") {
                    return "#2E82BF"
                } else if (d.PARTY === "R") {
                    return "#E12B1B"
                }
            })
            .on("click", function (d, i) {
                window.clicked = i;
                onclick()
            });

        //Set up label
        timelineSvg.selectAll(".label")
            .data(electionWinners, function (d) {
                return d.YEAR
            })
            .enter()
            .append("text")
            .attr("dx", function (d, i) {
                return timelineX(i);
            })
            .attr("dy", circle_radius * 6)
            .text(function (d) {
                return d.YEAR
            })
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .attr("fill", "black");
        onclick();
    }

    function onclick() {
        let m = d3.selectAll(".year_circles")
            .attr("r", function (d, i) {
                if (i === window.clicked) {
                    return 2 * circle_radius
                }
                return circle_radius
            })
            .attr("stroke", function (d, i) {
                if (i === window.clicked) {
                    return "black"
                }
                return "white"
            });

        d3.csv("data/election-results-" + String(electionWinners[window.clicked].YEAR)
            + ".csv", function (error, data) {
            votePercentageChart.update(data, colorScale);
            tileChart.update(data, colorScale);
            electoralVoteChart.update(data, colorScale);
        });
    }
}