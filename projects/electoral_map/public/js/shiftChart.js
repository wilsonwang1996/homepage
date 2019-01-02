function ShiftChart() {
    this.update = update
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    //Set up scale bar on the right
    d3.select("#shiftChart")
        .style("width", w * 0.2 + 'px');
    let shiftSvg = d3.select("#shiftChart")
        .append("svg")
        .attr("class", "shiftSvg")
        .attr("width", w * 0.2)
        .attr("height", w);
    let statesList = shiftSvg.append("g")
        .attr("class", "stateList")

    function update(selected_states) {
        stateNames = statesList.selectAll(".stateNames")
            .data(selected_states);
        stateNames.enter()
            .append("text")
            .attr("class", "stateNames")
            .attr("text-anchor", "start")
            .attr("font-size", "15px")
            .attr("fill", "black")
            .attr("dx", 50)
            .attr("dy", function (d, i) {
                return 20 + 15 * i
            })
            .merge(stateNames)
            .text(function (d) {
                return d
            })
        stateNames
            .exit()
            .remove();
    }
}