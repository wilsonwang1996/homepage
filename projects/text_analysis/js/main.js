// Get window width and height
let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

// Set up height for bubble graph sections, this helps the report to scale with the window view
d3.selectAll("div.bubbleGraph")
    .style("height", Math.max(0.6 * w, document.getElementById("EnglishBubbleGraphExplanation").clientHeight) + "px")


// Create bubble graphics for all three countries' fairy tales
let engBabbleGraph = new heatBabbleGraph("data/top50eng.csv", "div#EnglishBubbleGraph", "English Fairy Tale Word Ranking");
let rusBabbleGraph = new heatBabbleGraph("data/top50rus.csv", "div#RussianBubbleGraph", "Russian Fairy Tale Word Ranking");
let indBabbleGraph = new heatBabbleGraph("data/top50ind.csv", "div#IndianBubbleGraph", "Indian Fairy Tale Word Ranking");

// Position the text relative to the babble graph
d3.select("div#EnglishBubbleGraphExplanation")
    .style("top", Math.max(0, (0.6 * w - document.getElementById("EnglishBubbleGraphExplanation").clientHeight) * 0.4) + "px")

d3.select("div#RussianBubbleGraphExplanation")
    .style("top", Math.max(0, (0.6 * w - document.getElementById("RussianBubbleGraphExplanation").clientHeight) * 0.4) + "px")

d3.select("div#IndianBubbleGraphExplanation")
    .style("top", Math.max(0, (0.6 * w - document.getElementById("IndianBubbleGraphExplanation").clientHeight) * 0.4) + "px")

// Create parallel coordinate graphics
let driveParallelCoordinate = new parallelCoordinate("data/drives.csv", "div#drivesParallelCoordinate", "Motivation Scales");

let concernParallelCoordinate = new parallelCoordinate("data/concerns.csv", "div#concernsParallelCoordinate", "Life Concern Scales");

// Position the text relative to the parallel coordnates
d3.select("div#drivesParallelCoordinateExplanation")
    .style("top", Math.max(0, (0.4 * w - document.getElementById("drivesParallelCoordinateExplanation").clientHeight) * 0.4) + "px")

d3.select("div#concernsParallelCoordinateExplanation")
    .style("top", Math.max(0, (0.4 * w - document.getElementById("concernsParallelCoordinateExplanation").clientHeight) * 0.4) + "px")

let firstConnectedScatterPlot = new connectedScatterPlot("div#firstConnectedScatterPlot")