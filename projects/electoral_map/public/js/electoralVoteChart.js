function ElectoralVoteChart(shiftChart) {
    this.update = update;
    const perc_regex = /\d+.\d/;
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let electoralVoteSvg = d3.select("#electoral-vote")
        .append("svg")
        .attr("width", w * 0.7)
        .attr("height", w * 0.7 * 0.1);
    let I_Label = electoralVoteSvg
        .append("text")
        .attr("dx", 0)
        .attr("dy", w * 0.7 * 0.05)
        .attr("text-anchor", "start")
        .attr("font-size", "20px")
        .attr("fill", "green");
    let D_Label = electoralVoteSvg
        .append("text")
        .attr("dy", w * 0.7 * 0.05)
        .attr("text-anchor", "start")
        .attr("font-size", "20px");
    let R_Label = electoralVoteSvg
        .append("text")
        .attr("dx", w * 0.7)
        .attr("dy", w * 0.7 * 0.05)
        .attr("text-anchor", "end")
        .attr("font-size", "20px");
    let tag_50 = electoralVoteSvg
        .append("text")
        .attr("dx", w * 0.35)
        .attr("dy", w * 0.7 * 0.02)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black");
    let x = d3.scaleLinear().range([0, w * 0.7]);

    function update(data, colorScale) {
        let brush = d3.brushX()
            .extent([[0, w * 0.7 * 0.03], [w * 0.7, w * 0.7 * 0.1]])
            .on("start brush end", brushmoved);
        let I_states = [];
        let DR_states = [];
        let EV_sum = [];
        let total_EV = 0;
        data.forEach(function (d) {
            if (Number(d.I_Percentage) > Number(d.D_Percentage)
                && Number(d.I_Percentage) > Number(d.R_Percentage)) {
                I_states.push(d)
            } else {
                DR_states.push(d)
            }
        });
        DR_states.sort(function (a, b) {
            let diff_a = +a["R_Percentage"].match(perc_regex) - a["D_Percentage"].match(perc_regex);
            let diff_b = +b["R_Percentage"].match(perc_regex) - b["D_Percentage"].match(perc_regex);
            return diff_a - diff_b
        });

        I_states.forEach(function (d) {
            EV_sum.push(total_EV)
            total_EV += Number(d.Total_EV)
        });
        DR_states.forEach(function (d) {
            EV_sum.push(total_EV)
            total_EV += Number(d.Total_EV)
        });

        let Ibox =
            electoralVoteSvg.selectAll(".Ibox")
                .data(I_states);
        Ibox.enter()
            .append("rect")
            .merge(Ibox)
            .attr("class", "Ibox")
            .attr("x", function (d, i) {
                return w * 0.7 * EV_sum[i] / total_EV
            })
            .attr("y", w * 0.7 * 0.06)
            .attr("width", function (d) {
                return w * 0.65 * d.Total_EV / total_EV
            })
            .attr("height", w * 0.7 * 0.03)
            .attr("fill", "green")
        Ibox
            .exit()
            .remove();

        //Set up DR boxes for the matter
        let DRbox =
            electoralVoteSvg.selectAll(".DRbox")
                .data(DR_states);
        DRbox.enter()
            .append("rect")
            .merge(DRbox)
            .attr("class", "DRbox")
            .attr("x", function (d, i) {
                return w * 0.7 * EV_sum[i + I_states.length] / total_EV
            })
            .attr("y", w * 0.7 * 0.06)
            .attr("width", function (d) {
                return w * 0.65 * d.Total_EV / total_EV
            })
            .attr("height", w * 0.7 * 0.03)
            .attr("fill", function (d) {
                var perTr = +d["R_Percentage"].match(perc_regex);
                var perCl = +d["D_Percentage"].match(perc_regex);
                var diff = +perTr - +perCl;
                return colorScale(+diff);
            })
        DRbox
            .exit()
            .remove();
        let I_EV_count = 0, D_EV_count = 0, R_EV_count = 0;
        I_states.forEach(function (d) {
            I_EV_count += +d.Total_EV
        });
        DR_states.forEach(function (d) {
            if (+d["R_Percentage"].match(perc_regex) - d["D_Percentage"].match(perc_regex) > 0) {
                R_EV_count += +d.Total_EV
            } else {
                D_EV_count += +d.Total_EV
            }
        });
        if (I_EV_count !== 0) {
            I_Label.text(I_EV_count)
        } else {
            I_Label.text("")
        }
        D_Label
            .attr("dx", w * 0.7 * EV_sum[I_states.length] / total_EV)
            .attr("fill", colorScale.range()[0])
            .text(D_EV_count);
        R_Label
            .attr("dx", w * 0.7)
            .attr("fill", colorScale.range()[colorScale.range().length - 1])
            .text(R_EV_count);
        electoralVoteSvg.append("line")
            .attr("x1", w * 0.35)
            .attr("y1", w * 0.7 * 0.055)
            .attr("x2", w * 0.35)
            .attr("y2", w * 0.7 * 0.095)
            .attr("stroke", "black");
        tag_50
            .text("Electoral Vote (" + (Math.round(total_EV / 2) + 1) + " needed to win)")

        let gBrush = document.getElementsByClassName("brush");
        while (gBrush.length !== 0) {
            gBrush[0].parentNode.removeChild(gBrush[0])
        }

        gBrush = electoralVoteSvg.append("g")
            .attr("class", "brush")
            .call(brush);

        function brushmoved() {
            let states = I_states.concat(DR_states);
            let selection = d3.event.selection;
            let selected_states = [];
            states.forEach(function (d, i) {
                let start_point = w * 0.7 * EV_sum[i] / total_EV;
                let end_point = start_point + w * 0.7 * d.Total_EV / total_EV;
                if (selection !== null) {
                    if (start_point < selection[0] && end_point < selection[0]) {
                    } else if (start_point > selection[1] && end_point > selection[1]) {
                    } else {
                        selected_states.push(d.State)
                    }
                }
            });
            shiftChart.update(selected_states)
        }
    }
}