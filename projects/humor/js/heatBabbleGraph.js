function heatBabbleGraph(babbleGraphID, data) {
    //detect page layout
    const w = document.getElementById(babbleGraphID).offsetWidth;

    // Scale for circle radius
    let r_scale = d3.scaleLinear()
        .range([15, 50])
        .domain([0, 0.04]);

    // Scale for color heat map
    let colorscale = d3.scaleLinear()
        .range(["lightskyblue", "coral"])
        .domain([1, 10]);

    // Create svg canvas
    let svg = d3.select("#" + babbleGraphID)
        .append('svg')
        .attr("class", "babbleGraphSvg")
        .attr("width", w)
        .attr("height", w);

    // Create simulation for stuff
    let simulation = d3.forceSimulation();

    // Set up simulation statistics
    // Set up collision slightly higher than radius to make sure there is a smooth
    // gap between bubbles
    simulation.nodes(data)
        .force("charge", d3.forceManyBody().strength(5))
        .force("collide", d3.forceCollide().radius(function (d) {
            return r_scale(d.weight) + 2
        }))
        .force("center", d3.forceCenter(w * 0.5, w * 0.5))
        .alpha(0.5);

    // Create svg element g to contain multiple objects
    let node = svg.selectAll(".node")
        .data(data)
        .enter()
        .append('g');

    // Create the circles to represent data nodes
    node.append("circle")
        .attr("r", function (d) {
            return r_scale(d.weight)
        })
        .attr("fill", function (d) {
            return colorscale(d.term.length)
        });

    // Create the text content for each node
    node.append("text")
        .attr("dx", 0)
        .attr('dy', 0)
        .attr("font-size", 12)
        .attr('text-anchor', 'middle')
        .text(function (d) {
            return d.term
        });

    // Make sure to correctly posite the svg <g> tags so that they move
    // according to the simulation
    simulation.on("tick", function () {
        node
            .attr('transform', function (d) {
                return "translate(" + d.x + " " + d.y + ")"
            })
    });

    // // Add graph names
    // svg.append('text')
    //     .attr('x', w * 0.25)
    //     .attr('y', w * 0.5)
    //     .attr('text-anchor', 'middle')
    //     .attr('class', 'label')
    //     .attr('font-size', 20)
    //     .text(graphName);

}