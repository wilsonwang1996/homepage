function SearchChart(data) {
    const chartDiv = d3.select("#chart-search");
    const divWidth = window.innerWidth;
    const divHeight = window.innerHeight - 144;
    const selectorPaneSvg = chartDiv.append("svg")
        .attr("class", "chart-svg")
        .attr("height", 335)
        .attr("transform", "translate(16,0)")
        .attr("width", 300)
        .style("position", "absolute")
        .style("top", 0);
    let searchBarArea = chartDiv.append("div")
        .attr("class", "div-search-area")
        .style("position", "absolute")
        .style("top", "335px")
        .style("height", divHeight - 335 + "px")
        .style("width", "300px")
        .style("left", 0);
    const resultSvg = chartDiv.append("svg")
        .attr("class", "chart-svg")
        .attr("id", "result-svg")
        .attr("height", divHeight - 8)
        .attr("transform", "translate(24,0)")
        .attr("width", divWidth - 350)
        .style("position", "absolute")
        .style("right", 40);
    const selectionPaneNav = selectorPaneSvg.append("g")
        .attr("transform", "translate(5,10)");
    const navHead = selectionPaneNav.append("path")
        .attr("d", "M 0 0 L 30 0 L 55 25 L 30 50 L 0 50 L 25 25 Z")
        .attr("fill", "#4E98B5");

    const firstLetter = selectionPaneNav.append("path")
        .attr("d", "M 0 0 L 100 0 L 125 25 L 100 50 L 0 50 L 25 25 Z")
        .attr("fill", "#4E98B5")
        .attr("transform", "translate(40,0)");
    const firstLetterText = selectionPaneNav.append("text")
        .attr("x", 100)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("class", "dosis")
        .text("first")
        .style("display", "none");
    const firstTwoLetters = selectionPaneNav.append("path")
        .attr("d", "M 0 0 L 100 0 L 125 25 L 100 50 L 0 50 L 25 25 Z")
        .attr("fill", "#7BB9D1")
        .attr("transform", "translate(150,0)");
    const firstTwoLettersText = selectionPaneNav.append("text")
        .attr("x", 210)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("class", "dosis")
        .text("second")
        .style("display", "none");
    firstLetter.style("display", "none");
    firstTwoLetters.style("display", "none");
    const selectionPane = selectorPaneSvg.append("g")
        .attr("transform", `translate(5, 60)`);

    const width = 300;
    const partition = data => {
        const root = d3.hierarchy(data)
            .sum(d => d.size);
        return d3.partition()
            .size([2 * Math.PI, root.height + 1])
            (root);
    };
    const format = d3.format(",d");
    const radius = width / 5;
    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

    const color = d3.scaleOrdinal().range(d3.quantize(d3.interpolateRainbow, data[1].children.length + 1));
    const root = partition(data[1]);
    root.each(d => d.current = d);

    const g_pane = selectionPane.append("g")
        .attr("transform", `translate(${width / 2},${width / 2})`);

    const path = g_pane.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .enter().append("path")
        .attr("fill", d => {
            while (d.depth > 1) d = d.parent;
            return color(d.data.name);
        })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("d", d => arc(d.current));

    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    const label = g_pane.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .enter().append("text")
        .attr("class", "dosis")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name);

    const parentLabel = g_pane.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("fill", "black")
        .attr("class", "dosis")
        .text("Clear");

    const parent = g_pane.append("circle")
        .datum(root)
        .attr("id", "pane-clear-button")
        .attr("r", radius)
        .attr("fill", "lightgray")
        .attr("pointer-events", "all")
        .on("click", clicked);

    function clicked(p) {
        if (p["height"] === 1) {
            path.filter(d => !d.children)
                .style("cursor", "pointer")
                .on("click", clicked);
        }
        let signal = p["data"]["name"];
        if (signal.length === 1) {
            firstLetterText.text(signal);
            firstLetter.style("display", "block");
            firstLetterText.style("display", "block");
        } else if (signal.length === 2) {
            firstLetterText.text(signal[0]);
            firstTwoLettersText.text(signal);
            firstLetter.style("display", "block");
            firstTwoLetters.style("display", "block");
            firstLetterText.style("display", "block");
            firstTwoLettersText.style("display", "block");
            update(signal, "pane")
        } else {
            firstLetter.style("display", "none");
            firstTwoLetters.style("display", "none");
            firstLetterText.style("display", "none");
            firstTwoLettersText.style("display", "none");
            path.filter(d => !d.children)
                .style("cursor", null)
                .on("click", null);
        }
        if (p.depth !== 2) {
            parent.datum(p.parent || root);

            root.each(d => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });

            const t = g_pane.transition().duration(750);

            // Transition the data on all arcs, even the ones that aren’t visible,
            // so that if this transition is interrupted, entering arcs will start
            // the next transition from the desired position.
            path.transition(t)
                .tween("data", d => {
                    const i = d3.interpolate(d.current, d.target);
                    return t => d.current = i(t);
                })
                .filter(function (d) {
                    return +this.getAttribute("fill-opacity") || arcVisible(d.target);
                })
                .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
                .attrTween("d", d => () => arc(d.current));

            label.filter(function (d) {
                return +this.getAttribute("fill-opacity") || labelVisible(d.target);
            }).transition(t)
                .attr("fill-opacity", d => +labelVisible(d.target))
                .attrTween("transform", d => () => labelTransform(d.current));
        }
    }

    function arcVisible(d) {
        return d.y1 <= 2 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
        return d.y1 <= 2 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    function getAncestors(node) {
        let path = [];
        let current = node;
        while (current.parent) {
            path.unshift(current['data']['name']);
            current = current.parent;
        }
        return path;
    }

    searchBarArea.append("text")
        .text("Search By Selecting a Letter")
        .style("position", "absolute")
        .style("top", "-275px")
        .style("left", "16px")
        .attr("class", "dosis purple-text");


    searchBarArea.append("text")
        .text("Search by Typing in Key Word (Two or more)")
        .style("position", "absolute")
        .style("top", "20px")
        .style("left", "16px")
        .attr("class", "dosis purple-text");

    searchBarArea.append("input")
        .attr("id", "word-search-input")
        .attr("type", "text")
        .attr("name", "keyword")
        .attr("value", "nation")
        .style("position", "absolute")
        .style("top", "50px")
        .style("left", "16px")
        .attr("class", "dosis")
    searchBarArea.append("button")
        .attr("class", "btn btn-search dosis")
        .attr("onclick", "")
        .text("Search")
        .style("position", "absolute")
        .style("top", "38px")
        .style("left", "210px")
        .on("click", function () {
            let searchContent = document.getElementById('word-search-input').value;
            if (searchContent !== "") {
                update(searchContent, "text");
            }
        });


    function update(keyword, type) {
        if (keyword.length < 2) {
            return null
        }
        let myNode = document.getElementById("result-svg");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        //Now add babble chart
        // Create simulation for stuff
        let babbleSimulation = d3.forceSimulation();
        let mergedDict = data[0];
        let slicedDict = mergedDict.slice(0, 20);
        if (type === "pane") {
            slicedDict = mergedDict.filter(word => String(word["word"]).substring(0, 2) === keyword)
        } else if (type === "text") {
            slicedDict = mergedDict.filter(word => String(word["word"]).includes(keyword))
        }

        const babbleChartSize = divWidth - 350;

        // Set up simulation statistics
        // Set up collision slightly higher than radius to make sure there is a smooth
        // gap between bubbles
        babbleSimulation.nodes(slicedDict)
            .force("charge", d3.forceManyBody().strength(5))
            .force("collide", d3.forceCollide().radius(30))
            .force("center", d3.forceCenter(babbleChartSize * 0.5, window.innerHeight * 0.5 - 72))
            .alpha(0.5);

        // Create svg element g to contain multiple objects
        let babbleChartNode = resultSvg.selectAll(".node")
            .data(slicedDict)
            .enter()
            .append('g');

        const babbleColors = ["#8794D8", "#A185D8", "#7BB9D1", "#4E98B5"];


        // Create the text content for each node
        babbleChartNode.append("text")
            .attr("dx", 0)
            .attr('dy', 0)
            .attr("font-size", 12)
            .attr('text-anchor', 'middle')
            .attr("class", "dosis purple-text")
            .text(function (d) {
                return d.word
            });

        // Create the circles to represent data nodes
        babbleChartNode.append("circle")
            .attr("r", 30)
            .attr("fill", function () {
                return babbleColors[Math.floor(Math.random() * babbleColors.length)];
            })
            .style("opacity", 0.3)
            .style("cursor", "progress")
            .append("title")
            .text(function (d) {
                return "\n\n" + "Age of Acquisition: " + d["AoA"] + "\n"
                    + "Prevalence: " + d["Prevalence"] + "\n"
                    + "Arousal: " + d["arousal"] + "\n"
                    + "Concreteness: " + d["concreteness"] + "\n"
                    + "Dominance: " + d["dominance"] + "\n"
                    + "Valence: " + d["valence"]
            });

        // Make sure to correctly posite the svg <g> tags so that they move
        // according to the simulation
        babbleSimulation.on("tick", function () {
            babbleChartNode.attr('transform', function (d) {
                return "translate(" + d.x + " " + d.y + ")"
            })
        });
    }

    update("nation", "text")
}
