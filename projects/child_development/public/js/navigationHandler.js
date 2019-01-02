// Set up default chart
d3.selectAll(".chart")
    .style("display", "none");
d3.select("#chart-growth")
    .style("display", "block");

//Function handles click events
function showChart(id) {
    d3.selectAll(".chart")
        .style("display", "none");
        d3.select("#" + id)
            .style("display", "block");
}
