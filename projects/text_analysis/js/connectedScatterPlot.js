function connectedScatterPlot(graphID) {
    // Get path width to make graphics scale with the web browser window
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    // Set up svg dimensions
    let margin = {top: 30, right: 30, bottom: 70, left: 30},
        width = w - margin.left - margin.right,
        height = w * 0.2 - margin.top - margin.bottom;

    // Set up outer svg
    let svg = d3.select(graphID).append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Set up inner svg
    let svg_adjusted = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up scale vectors
    let genderXScale = d3.scaleLinear()
            .range([0, width * 0.3]),
        genderYScale = d3.scaleLinear()
            .range([height, 0]),
        perceptXScale = d3.scaleLinear()
            .range([width * 0.33, width * 0.63]),
        perceptYScale = d3.scaleLinear()
            .range([height, 0]),
        timeXScale = d3.scaleLinear()
            .range([width * 0.66, width * 0.96]),
        timeYScale = d3.scaleLinear()
            .range([height, 0]),
        countryScale = {
            "English": "Blue",
            "Russian": "Red",
            "Indian": "Green"
        };

    let genderXAxis = d3.axisBottom()
        .scale(genderXScale);

    let genderYAxis = d3.axisLeft()
        .scale(genderYScale);

    let perceptXAxis = d3.axisBottom()
        .scale(perceptXScale);

    let perceptYAxis = d3.axisLeft()
        .scale(perceptYScale);

    let timeXAxis = d3.axisBottom()
        .scale(timeXScale);

    let timeYAxis = d3.axisLeft()
        .scale(timeYScale);

    // Load data parallel
    var files = ["data/gender.csv", "data/percept.csv", "data/time.csv"];
    Promise.all(files.map(url => d3.csv(url))).then(function (values) {

        //Update gender Axis
        genderXScale.domain([0, d3.max(values[0], function (d) {
            return d.female;
        })]).nice();
        genderYScale.domain([0, d3.max(values[0], function (d) {
            return d.male;
        })]).nice();

        perceptXScale.domain([0, d3.max(values[1], function (d) {
            return d.see;
        })]).nice();
        perceptYScale.domain([0, d3.max(values[1], function (d) {
            return d.feel;
        })]).nice();

        timeXScale.domain([0, d3.max(values[2], function (d) {
            return d.focuspast;
        })]).nice();
        timeYScale.domain([0, d3.max(values[2], function (d) {
            return d.focusfuture;
        })]).nice();

        // adding axes is also simpler now, just translate x-axis to (0,height) and it's alread defined to be a bottom axis.
        svg_adjusted.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'x axis')
            .call(genderXAxis);

        svg_adjusted.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'y axis')
            .call(genderYAxis);

        svg_adjusted.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'x axis')
            .call(perceptXAxis);

        svg_adjusted.append('g')
            .attr('transform', 'translate(' + width * 0.33 + ',0)')
            .attr('class', 'y axis')
            .call(perceptYAxis);

        svg_adjusted.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'x axis')
            .call(timeXAxis);

        svg_adjusted.append('g')
            .attr('transform', 'translate(' + width * 0.66 + ',0)')
            .attr('class', 'y axis')
            .call(timeYAxis);

        // Add text label
        svg_adjusted.append('text')
            .attr('x', 10)
            .attr('y', 10)
            .attr('class', 'label')
            .text('male index');

        svg_adjusted.append('text')
            .attr('x', 10 + width * 0.28)
            .attr('y', height - 10)
            .attr('text-anchor', 'end')
            .attr('class', 'label')
            .text('female index');

        svg_adjusted.append('text')
            .attr('x', 10 + width * 0.14)
            .attr('y', height + 45)
            .attr('text-anchor', 'middle')
            .attr('class', 'label')
            .attr('font-size', 30)
            .text('Gender Ratio');

        svg_adjusted.append('text')
            .attr('x', 10 + width * 0.33)
            .attr('y', 10)
            .attr('class', 'label')
            .text('feel index');

        svg_adjusted.append('text')
            .attr('x', 10 + width * 0.62)
            .attr('y', height - 10)
            .attr('text-anchor', 'end')
            .attr('class', 'label')
            .text('see index');

        svg_adjusted.append('text')
            .attr('x', 10 + width * 0.48)
            .attr('y', height + 45)
            .attr('text-anchor', 'middle')
            .attr('class', 'label')
            .attr('font-size', 30)
            .text('Perception Ratio');

        svg_adjusted.append('text')
            .attr('x', 10 + width * 0.66)
            .attr('y', 10)
            .attr('class', 'label')
            .text('future index');

        svg_adjusted.append('text')
            .attr('x', 10 + width * 0.96)
            .attr('y', height - 10)
            .attr('text-anchor', 'end')
            .attr('class', 'label')
            .text('past index');

        svg_adjusted.append('text')
            .attr('x', 10 + width * 0.82)
            .attr('y', height + 45)
            .attr('text-anchor', 'middle')
            .attr('class', 'label')
            .attr('font-size', 30)
            .text('Time Ratio');

        let pointRadius = width * 0.005

        // Add the nodes
        let point_gender = svg_adjusted.selectAll('.pointGender')
            .data(values[0])
            .enter().append('circle')
            .attr('class', 'pointGender')
            .attr('cx', function (d) {
                return genderXScale(d.female);
            })
            .attr('cy', function (d) {
                return genderYScale(d.male);
            })
            .attr('r', pointRadius)
            .style('fill', function (d) {
                return countryScale[d.name];
            });

        let point_percept = svg_adjusted.selectAll('.pointPercept')
            .data(values[1])
            .enter().append('circle')
            .attr('class', 'pointPercept')
            .attr('cx', function (d) {
                return perceptXScale(d.see);
            })
            .attr('cy', function (d) {
                return perceptYScale(d.feel);
            })
            .attr('r', pointRadius)
            .style('fill', function (d) {
                return countryScale[d.name];
            });

        let point_time = svg_adjusted.selectAll('.pointTime')
            .data(values[2])
            .enter().append('circle')
            .attr('class', 'pointTime')
            .attr('cx', function (d) {
                return timeXScale(d.focuspast);
            })
            .attr('cy', function (d) {
                return timeYScale(d.focusfuture);
            })
            .attr('r', pointRadius)
            .style('fill', function (d) {
                return countryScale[d.name];
            });

        // Draw the lines
        Object.keys(countryScale).forEach(drawPolylineForCountry)

        function drawPolylineForCountry(name) {
            let path = "" + genderXScale(filterByName(values[0], name)['female'])
                + ',' + genderYScale(filterByName(values[0], name)['male'])
                + ' ' + perceptXScale(filterByName(values[1], name)['see'])
                + ',' + perceptYScale(filterByName(values[1], name)['feel'])
                + ' ' + timeXScale(filterByName(values[2], name)['focuspast'])
                + ',' + timeYScale(filterByName(values[2], name)['focusfuture']);
            let lineIndian = svg_adjusted.append('polyline')
                .attr('fill', 'none')
                .attr('stroke', countryScale[name])
                .attr('points', path)

            function filterByName(data, name) {
                return data.filter(function (d) {
                    return d.name == name
                })[0]
            }
        }


    });
}