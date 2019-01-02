

//for the two baby graphs alongside the main scatterplot, initialize with all the data
function WordsByAgeSide(data, countData) {
    let allData = data

    var width = 300
    var height = 210
    var xMargin = 10;
    var yMargin = 35;
    var range = [0,14]
    //countData.unshift([0,0])
    let xScale = d3.scaleLinear()
      .domain(range)
      .range([xMargin+45, width-xMargin]);
    let yScale = d3.scaleLinear()
      .domain([2000,5000])
      .range([height-yMargin, yMargin+10]);


    //set up data for use in rate of growth chart
    let derivArray = []
    for(var i=1; i<countData.length; i++) {
      derivArray[i] = [countData[i][0], (countData[i][1] - countData[i-1][1])]
    }
    derivArray[0]=[2,countData[0][1]]

    d3.select("#chart-growth").select("#words-by-age-side").append("div")
        .attr("id", "derivative-chart")

    d3.select("#chart-growth").select("#words-by-age-side").append("div")
        .attr("id", "words-by-age-stats")




    var derivSvg = d3.select("#chart-growth").select("#words-by-age-side").select("#derivative-chart").append("svg")
        .attr("width", width)
        .attr("height", height)

    var statsSvg = d3.select("#chart-growth").select("#words-by-age-side").select("#words-by-age-stats").append("svg")
        .attr("width", width)
        .attr("height", height)


    //spawn differently when we are doing all data vs a range
    //takes in the range we're dealing with
    this.update = function(range){
      //connect the dots, lalalala
      var valueline = d3.line()
          .x(function(d) { return xScale(+d[0]); })
          .y(function(d) { return yScale(+d[1]); })


      d3.select("#words-by-age-side").selectAll("svg").selectAll(".words-by-age-side-data").remove()

      // yeah, yeah, this is shorter code than making a new datatype and nonsense
      for(var i=0; i<derivArray.length-1; ++i) {
        console.log("h")
        d3.select("#chart-growth").select("#words-by-age-side").select("#derivative-chart").select("svg")
            .append("line")
            .attr("x1", xScale(derivArray[i][0]))
            .attr("x2", xScale(derivArray[i+1][0]))
            .attr("y1", yScale(derivArray[i][1]))
            .attr("y2", yScale(derivArray[i+1][1]))
            .style("stroke", function() {
              if(derivArray[i][0]>=range[0]&&derivArray[i+1][0]<=range[1]) {
                return "#137196"
              }
              else {
                  return "#7BB9D1"
              }
            })
            .style("stroke-weight", 2)
            .attr("class", "words-by-age-side-data scatterplot-line")

      }


      var circle = d3.select("#chart-growth").select("#words-by-age-side").select("#derivative-chart").select("svg").selectAll("circle")
            .data(derivArray)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return xScale(d[0]) })
            .attr("cy", function(d) { return yScale(d[1]) })
            .attr("r", 5)
            .attr("class", "words-by-age-side-data")
            .style("fill", function(d,i) {
              if(d[0]>=range[0] && d[0]<=range[1]) {
                return "#137196"
              }
              return "#7BB9D1"
            })
            .on("mouseover", function(d,i) {
              let xPos = this.cx.baseVal.value-110
              let yPos = this.cy.baseVal.value
              if(d[0]==2) { xPos=this.cx.baseVal.value }
              let line1 = "Age: " + d[0]
              let line2 = d[1] + " words/year"

              derivSvg.append("rect")
                  .attr("x", xPos)
                  .attr("y", yPos)
                  .attr("height",37)
                  .attr("width", 90)
                  .attr("class", "wbaTT tt-box")
                  .attr("pointer-events","none")
              derivSvg.append("text")
                  .attr("x", xPos+5)
                  .attr("y", yPos+15)
                  .attr("class","wbaTT dosis tt-text")
                  .style("font-size", 12)
                  .text(line1)
              derivSvg.append("text")
                  .attr("x", xPos+5)
                  .attr("y", yPos+30)
                  .attr("class","wbaTT dosis tt-text")
                  .style("font-size", 12)
                  .text(line2)
            })
            .on("mouseout", function(d,i) {
              d3.selectAll(".wbaTT").remove()

            } );


      //set up axes
      var xAxis = d3.axisBottom(xScale)
        .ticks(8)
      var x = derivSvg.append("g")
        .call(xAxis)
        .attr("transform", "translate(0," + (height-35) + ")")
        //.style("font-size", "10pt")
        .style("pointer-events", "none")
        .attr("class", "dosis color-primary-0");

      var yAxis = d3.axisLeft(yScale)
        .ticks(4)
      var y = derivSvg.append("g")
        .call(yAxis)
        .attr("transform", "translate(" + 55+ ",0)")
        .style("pointer-events", "none")
        .attr("class", "dosis color-primary-0");

      var xLabel = d3.select("#derivative-chart").select("svg")
          .append("text")
          .attr("x", width/2)
          .attr("y", height-7)
          .attr("class", "dosis purple-text")
          .style("font-size", "8pt")
          .text("Age")

      var yLabel = d3.select("#derivative-chart").select("svg")
          .append("text")
          .style("text-anchor", "center")
          .attr("x",-1*height/2-45)
          .attr("y",12)
          .attr("class", "dosis purple-text")
          .attr("transform", "rotate(270)" )
          .style("font-size", "8pt")
          .text("Words Learned");


      //accumulate stats for stat box
      //get all the summary stats, need to figure out what I actually want to show so there's not too much overlap with future parts
      var rangeString = (range[0]==range[1]) ? ("Summary for age " + range[0]) : ("Summary for age " + range[0] + " to " + range[1])
      var minInd = function(){
        for(var i=0;i<8;i++){
          if(derivArray[i][0]==range[0]) {
            return i;
          }
        }
      }()
      var maxInd = function(){
        for(var i=0;i<8;i++){
          console.log(derivArray[i][0])
          if(derivArray[i][0]==range[1]) {
            return i;
          }
        }
      }()
      var wordsLearned = function(){
                var numWords=0
                for(var i=minInd; i<=maxInd;i++) {
                  console.log(i)
                  numWords+= +derivArray[i][1]
                }
                return numWords;
              }();

      var totalWords = countData[maxInd][1];
      var avgDerivative = range[1]==range[0] ? derivArray[maxInd][1] : Math.round(wordsLearned/(range[1]-range[0]))
      summaryStats = [
        rangeString,
        "Words Learned: " + wordsLearned,
        "Total Words Known: " + totalWords,
        "Percent of Adult Words Known: " + Math.round(totalWords/42000*10000)/100+"%",
        "Average Rate of Growth: " + avgDerivative + " words/year"

      ];

      //append summary stats
      d3.select("#words-by-age-stats").select("svg").selectAll("text").remove()

      d3.select("#words-by-age-stats").select("svg").selectAll("text")
        .data(summaryStats)
        .enter()
        .append("text")
        .attr("x", function(d,i) { return 10 })
        .attr("y", function(d,i) { return i*18+15 })
        .style("font-weight", function(d,i) { if (i==0) { return "bold" } })
        .style("text-decoration", function(d,i) { if (i==0) { return "underline" } })
        .attr("class", function(d,i) { return i==0 ? "dosis teal-text" : "dosis purple-text" })
        .text(function(d) { return d });


    }

    this.update(range)
}
