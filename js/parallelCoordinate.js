function parallelCoordinate(data_path, graphID, graphName) {
    // Get path width to make graphics scale with the web browser window
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    // Set up svg dimensions
    let margin = {top: 30, right: 10, bottom: 70, left: 10},
        width = w * 0.5 - margin.left - margin.right,
        height = w * 0.3 - margin.top - margin.bottom;

    // Set up xScale and create yScale array
    let xScale = d3.scalePoint().range([0, width]).padding(1),
        colorScale = d3.scaleLinear().range(["lightskyblue", "coral"]),
        yScale = {},
        dragging = {},
        countryScale = {
            "English": "Blue",
            "Russian": "Red",
            "Indian": "Green"
        };

    // Set up outer svg
    let svg = d3.select(graphID).append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Set up inner svg
    let svg_adjusted = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(data_path).then(function (data) {
        // Set up xScale
        let dimensions = Object.keys(data[0]).slice(1)
        xScale.domain(dimensions)
        colorScale.domain([0, dimensions.length])

        // Set up yScale
        dimensions.forEach(function (d) {
            yScale[d] = d3.scaleLinear()
                .range([height, 0])
                .domain(d3.extent(data, function (p) {
                    return +p[d]
                }))
        });

        // Draw the lines
        let lines = svg_adjusted.append('g')
            .selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('stroke', function (d) {
                return countryScale[d.name]
            })
            .attr('fill', 'none')
            .attr('d', path);

        // Add a group element for each dimension.
        const g = svg_adjusted.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function (d) {
                return "translate(" + xScale(d) + ")";
            })
            // Inspired by: https://bl.ocks.org/jasondavies/1341281, Jason Davies
            // It is in d3 v2 (totally very old version) and it inspired me about draggable axis.
            .call(
                d3.drag()
                    .on("start", function (d) {
                        dragging[d] = xScale(d);
                    })
                    .on("drag", function (d) {
                        dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                        lines.attr("d", path);
                        dimensions.sort(function (a, b) {
                            return position(a) - position(b);
                        });
                        xScale.domain(dimensions);
                        g.attr("transform", function (d) {
                            return "translate(" + position(d) + ")";
                        })
                    })
                    .on("end", function (d) {
                        delete dragging[d];
                        d3.select(this).transition().attr("transform", "translate(" + xScale(d) + ")");
                        lines.transition().attr("d", path);
                    })
            );

        // Add an axis and title.
        g.append("g")
            .attr("class", "axis")
            .style("color", function (d, i) {
                return colorScale(i);
            })
            .each(function (d) {
                d3.select(this).call(d3.axisLeft().scale(yScale[d]));
            })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .attr("fill", function (d, i) {
                return colorScale(i);
            })
            .text(function (d) {
                return d;
            });

        // Locate the position of axis, if axis is not selected then go with the old position
        function position(d) {
            var v = dragging[d];
            return v == null ? xScale(d) : v;
        }

        // Locate the line path of each line
        function path(d) {
            return d3.line()(dimensions.map(function (p) {
                return [position(p), yScale[p](d[p])];
            }));
        }

        svg_adjusted.append('text')
            .attr('x', width * 0.50)
            .attr('y', height + 45)
            .attr('text-anchor', 'middle')
            .attr('class', 'label')
            .attr('font-size', 30)
            .text(graphName);
    })
}