function VotePercentageChart() {
    this.update = update;
    let tooltip = d3.select("#votes-percentage")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let votePercSvg = d3.select("#votes-percentage")
        .append("svg")
        .attr("width", w * 0.7)
        .attr("height", w * 0.7 * 0.1);
    let I_Box = votePercSvg
        .append("rect")
        .attr("y", w * 0.7 * 0.035)
        .attr("height", w * 0.7 * 0.03)
        .attr("fill", "green")
        .attr("class", "vote_box");
    let D_Box = votePercSvg
        .append("rect")
        .attr("y", w * 0.7 * 0.035)
        .attr("height", w * 0.7 * 0.03)
        .attr("class", "vote_box");
    let R_Box = votePercSvg
        .append("rect")
        .attr("y", w * 0.7 * 0.035)
        .attr("height", w * 0.7 * 0.03)
        .attr("class", "vote_box");
    let I_Label = votePercSvg
        .append("text")
        .attr("dx", 0)
        .attr("dy", w * 0.7 * 0.015)
        .attr("text-anchor", "start")
        .attr("font-size", "12px")
        .attr("fill", "green");
    let D_Label = votePercSvg
        .append("text")
        .attr("dy", w * 0.7 * 0.015)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px");
    let R_Label = votePercSvg
        .append("text")
        .attr("dy", w * 0.7 * 0.015)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px");
    let tag_50 = votePercSvg
        .append("text")
        .attr("dx", w * 0.35)
        .attr("dy", w * 0.7 * 0.095)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black");

    function update(data, colorScale) {
        //Process data
        const D_Nominee = data[0]["D_Nominee"];
        const R_Nominee = data[0]["R_Nominee"];
        const I_Nominee = data[0]["I_Nominee"];
        let D_Vote = 0, I_Vote = 0, R_Vote = 0;
        data.forEach(function (d) {
                D_Vote += Number(d["D_Votes"]);
                R_Vote += Number(d["R_Votes"]);
                if (I_Nominee !== "") {
                    I_Vote += Number(d["I_Votes"]);
                }
            }
        );
        const totalVote = I_Vote + D_Vote + R_Vote;
        I_Percent = (100 * I_Vote / totalVote).toFixed(2);
        D_Percent = (100 * D_Vote / totalVote).toFixed(2);
        R_Percent = (100 * R_Vote / totalVote).toFixed(2);
        //Add boxes
        I_Box
            .attr("width", w * 0.7 * I_Vote / totalVote);


        d3.selectAll(".vote_box")
            .on("mouseover", function (d) {
                if (I_Vote === 0) {
                    tooltip.html(
                        "<font color='#0066CC'>" + D_Nominee + ": " + D_Vote + "</font>" + "<br>"
                        + "<font color='#CC0000'>" + R_Nominee + ": " + R_Vote + "</font>"
                    )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px")
                        .style("opacity", .9);
                } else {
                    tooltip.html(
                        "<font color='#0066CC'>" + D_Nominee + ": " + D_Vote + "</font>" + "<br>"
                        + "<font color='#CC0000'>" + R_Nominee + ": " + R_Vote + "</font>" + "<br>"
                        + "<font color='green'>" + I_Nominee + ": " + I_Vote + "</font>"
                    )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px")
                        .style("opacity", .9);
                }
            })
            .on("mouseout", function (d) {
                tooltip.style("opacity", 0);
            });
        D_Box
            .attr("x", w * 0.7 * I_Vote / totalVote)
            .attr("width", w * 0.7 * D_Vote / totalVote)
            .attr("fill", colorScale.range()[0]);
        R_Box
            .attr("x", w * 0.7 * (I_Vote + D_Vote) / totalVote)
            .attr("width", w * 0.7 * R_Vote / totalVote)
            .attr("fill", colorScale.range()[colorScale.range().length - 1]);
        if (I_Nominee !== "") {
            I_Label.text(I_Nominee + " (" + I_Percent + "%)")
        } else {
            I_Label.text("")
        }
        D_Label.attr("dx", w * 0.7 * (I_Vote + D_Vote * 0.6) / totalVote)
            .attr("fill", colorScale.range()[0])
            .text(D_Nominee + " (" + D_Percent + "%)");
        R_Label.attr("dx", w * 0.7 * (I_Vote + D_Vote + R_Vote * 0.5) / totalVote)
            .attr("fill", colorScale.range()[colorScale.range().length - 1])
            .text(R_Nominee + " (" + R_Percent + "%)");
        votePercSvg.append("line")
            .attr("x1", w * 0.35)
            .attr("y1", w * 0.7 * 0.03)
            .attr("x2", w * 0.35)
            .attr("y2", w * 0.7 * 0.07)
            .attr("stroke", "black");
        tag_50
            .text("Popular Vote(50%)");
    }
}