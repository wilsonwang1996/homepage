function ParallelCoordinate(parallelCoordinateID, spreadsheetID, data) {
    //slice data
    data = data.slice(1, 50);

    //create spreadsheet
    let spreadsheet = null;
    if (spreadsheetID != null) {
        spreadsheet = new Spreadsheet(spreadsheetID, data);
    }

    //detect page layout
    const w = document.getElementById(parallelCoordinateID).offsetWidth;

    //set up graph margin
    const margin = {top: 30, right: 10, bottom: 30, left: 10},
        width = w - margin.left - margin.right,
        height = 0.6 * w - margin.top - margin.bottom;

    //set up scale meters and dragging array
    const x = d3.scalePoint().range([0, width]).padding(1),
        y = {},
        dragging = {};

    //initialize lines and axis
    let line = d3.line(),
        axis = d3.axisLeft(),
        background,
        foreground;

    //initialize svg board
    const svg = d3.select("#" + parallelCoordinateID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Extract the list of dimensions and create a scale for each.
    let dimensions = Object.keys(data[0]).slice(2);
    x.domain(dimensions);

    // Set up yScale
    dimensions.forEach(function (d) {
        y[d] = d3.scaleLinear()
            .range([height, 0])
            .domain(d3.extent(data, function (p) {
                return +p[d]
            }))
    });

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path)
        .attr('fill', 'none')
        .attr('stroke', 'lightgrey');

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path)
        .attr('fill', 'none')
        .attr('stroke', function (d) {
            if (d['type'] === "humor") return "blue";
            return "red"
        });

    // Add a group element for each dimension.
    let g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) {
            return "translate(" + x(d) + ")";
        })
        .call(d3.drag()
            .on("start", function (d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function (d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function (a, b) {
                    return position(a) - position(b);
                });
                x.domain(dimensions);
                g.attr("transform", function (d) {
                    return "translate(" + position(d) + ")";
                })
            })
            .on("end", function (d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
            }));

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function (d) {
            d3.select(this).call(axis.scale(y[d]));
        })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .attr("fill", "black")
        .text(function (d) {
            return d;
        });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "parallel-brush")
        .attr("id", function (d) {
            return "brush" + d
        })
        .each(function (d) {
            d3.select(this).call(y[d].brush = d3.brushY()
                .extent([[-8, 0], [8, height]])
                .on("brush", brush));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    d3.select("#" + parallelCoordinateID).append("button")
        .text("Clear Brush Selection")
        .style("float", "left")
        .on("click", function () {
            clearBrush();
        });

    // d3.select("#" + document.getElementById(parallelCoordinateID).parentNode.id)
    //     .text("Clear Brush Selection")
    //     .style("float", "left")
    //     .on("click", function () {
    //         clearBrush();
    //     });


    function position(d) {
        let v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    function path(d) {
        return line(dimensions.map(function (p) {
            return [position(p), y[p](d[p])];
        }));
    }

    function brush() {
        let actives = dimensions.filter(function (p) {
                let brushElement = d3.select("#brush" + p)._groups[0][0];
                return d3.brushSelection(brushElement) !== null;
            }),
            extents = actives.map(function (p) {
                let brushElement = d3.select("#brush" + p)._groups[0][0];
                return d3.brushSelection(brushElement);
            });
        let selectedWords = [];
        foreground.style("display", function (d) {
            let selected = actives.every(function (p, i) {
                return extents[i][0] <= y[p](d[p]) && y[p](d[p]) <= extents[i][1];
            }) ? null : "none";
            if (selected === null) {
                selectedWords.push(d)
            }
            return selected;
        });
        spreadsheet.update((selectedWords))
        // parallelCoordinateDataTable.update(selectedWords)
        // this.spreadsheet.update(selectedWords)
    }

    function clearBrush() {
        d3.selectAll(".parallel-brush")
            .each(function (d) {
                console.log(d);
                d3.select(this).call(y[d].brush.move, null)
            });
        brush();
    }
}