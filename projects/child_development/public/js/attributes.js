function AgeBreakdownChart(allData) {
    let data = allData[0]
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var margin = {top: 30, right: 10, bottom: 10, left: 10},
        width = w - margin.left - margin.right,
        height = 0.3 * w - margin.top - margin.bottom;

    var scatterHeight = 300,
        scatterWidth = 360,
        scatterMargin = 15;

    var ageLower = 2,
        ageUpper = 14;



        const mainDiv = d3.select("#chart-attribute").append("div")
            .attr("id", "attribute-main-div")

        const ageBreakdown = mainDiv.append("div")
            .attr("id", "age-breakdown")
        const dimSelection = ageBreakdown.append("div")
            .attr("id", "age-breakdown-dimension-selection")
        dimSelection.append("div")
            .attr("id", "labels")
        dimSelection.append("div")
            .attr("id", "x-checkboxes")
        dimSelection.append("div")
            .attr("id", "y-checkboxes")

        ageBreakdown.append("div")
            .attr("id", "age-breakdown-overall-results")
            .style("margin-right", "20px")
            .style("margin-left", "20px")

        const attributeTrends = ageBreakdown.append("div")
            .attr("id", "attribute-trends")

        mainDiv.append("div")
            .attr("id", "age-breakdown-age-selection" )



    //helper function that returns a [d1,d2] array representing the dimension range based on what field we're looking at
    function getDomain(field) {
        console.log("in getDomain, field=" + field)
        domainA = 0;
        domainB = 0;
        if (field == "n/a") {
            domainA = 0;
            domainB = 5000;
        }
        else if (field == "Prevalence") {
            domainA = 0.47;
            domainB = 2.58;
        }
        else if (field == "concreteness") {
            domainA = 1;
            domainB = 5;
        }
        else {
            domainA = 1;
            domainB = 9;
        }

        return [domainA, domainB]
    }


    //helper function to return the xScale or yScale given a specific age range and field name,
    //along with whether it's a small one or a big one
    function getScaleForRange(xy, field) {
        let scalingLength = (xy == "y" ? scatterHeight : scatterWidth);

        let domain = getDomain(field)
        console.log("domain: " + domain)

        if (xy == "x") {
            return d3.scaleLinear()
                .domain(domain)
                .range([scatterMargin, scalingLength - scatterMargin]);
        }
        return d3.scaleLinear()
            .domain(domain)
            .range([scalingLength - scatterMargin, scatterMargin]);
    }

    //array to hold all categories we want
    let attrList = [
        blank = [
            label = "None",
            field = "n/a"
        ],
        valence = [
            label = "Valence",
            field = "valence",
            description = "Pleasantness of a word on a scale from 1-9, 5 being neutral"
        ],
        dominance = [
            label = "Dominance",
            field = "dominance",
            description = "Degree of control exerted by a word on a scale from 1-9, 5 being neutral"
        ],
        prevalence = [
            label = "Prevalence",
            field = "Prevalence",
            description = "Logarithmic proportion of how many people know a word"
        ],
        arousal = [
            label = "Arousal",
            field = "arousal",
            description = "Intensity of emotion provoked by a word on scale from 1-9, 5 being neutral"
        ],
        concreteness = [
            label = "Concreteness",
            field = "concreteness",
            description = "Concreteness/abstraction of a word is on a scale from 1-5, 3 being neutral"
        ]
    ]

    var xDimension = "n/a";
    var yDimension = "n/a";

    //age selection bar
    var selectionSvg = d3.select("#age-breakdown-age-selection").append("svg")
        .attr("width", 1385)
        .attr("height", 80)
    var sectionTitle = selectionSvg.append("text")
        .attr("x", w / 2)
        .attr("y", 15)
        .style("text-anchor", "middle")
        .attr("pointer-events", "none")
        .attr("class", "title dosis teal-text")
        .text(function () {
            var ans = "Words for age"
            if (ageLower == ageUpper) {
                return ans + " " + ageLower
            }
            return ans + "s " + ageLower + " to " + ageUpper
        });
    var selectionLine = selectionSvg.append("line")
        .attr("x1", margin.left * 2)
        .attr("x2", width - width / 8 + margin.left)
        .attr("y1", 40)
        .attr("y2", 40)
        .attr("stroke", "#7BB9D1")
        .attr("stroke-dasharray", "10,5,3,3,3,5")
        .attr("stroke-width", 2)
    var ages = [2, 4, 6, 8, 10, 12, 13, 14]
    var ageSelection = selectionSvg.selectAll("circle")
        .data(ages)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return i / ages.length * width + margin.left * 2
        })
        .attr("cy", 40)
        .attr("r", 15)
        .attr("class", "age-selection-circle color-secondary-2-3")
    var ageLabels = selectionSvg.selectAll("text")
        .data(ages)
        .enter()
        .append("text")
        .attr("x", function (d, i) {
            return i / ages.length * width + margin.left * 2
        })
        .attr("y", 70)
        .style("text-anchor", "middle")
        .attr("pointer-events", "none")
        .attr("class", "purple-text dosis")
        .text(function (d) {
            return d
        })
    //age 2 label since it doesn't want to cooperate
    selectionSvg.append("text")
        .attr("x", margin.left*2)
        .attr("y", 70)
        .style("text-anchor", "middle")
        .attr("pointer-events", "none")
        .attr("class", "purple-text dosis")
        .text("2")



    //--------BRUSH STUFF--------//
    const brush = d3.brushX()
        .extent([[0, 40 - 20], [width -4*margin.left, 40 + 20]])
        .on('end', brushed);
    const gBrush = selectionSvg.append('g')
        .attr('class', 'brush')
        .call(brush);

    function brushed() {
        var e = d3.event.selection
        var selected = selectionSvg.selectAll(".age-selection-circle").filter(function (d) {
            if (e == null) {
                return false;
            }
            return (d3.select(this).attr("cx") <= e[1])
                && (d3.select(this).attr("cx") >= e[0])
        });
        if (selected.data().length == 0) {
            console.log("didit")
            ageLower = 2;
            ageUpper = 14;
        }
        else {
            ageLower = parseInt(selected.data()[0]);
            ageUpper = parseInt(selected.data()[selected.data().length - 1]);
        }

        updateDim();
        //wordsByAgeSide.update([parseInt(selected.data()[0]), parseInt(selected.data()[selected.data().length-1])]);

    }

    var labelSvg = d3.select("#labels").append("svg")
        .attr("width", 150)
        .attr("height", 300);

    //Label for section
    var label = labelSvg.append("text")
        .attr("x", 10)
        .attr("y", 20)
        .attr("class", 'dosis purple-text')
        .style("text-decoration", "underline")
        .text("Choose Dimensions");

    //Text for checkboxes
    var cbLabels = labelSvg.selectAll(".cb-text")
        .data(attrList)
        .enter().append("text")
        .attr("class", "cb-text dosis teal-text")
        .attr("x", 10)
        .attr("y", function (d, i) {
            return i * 20 + 40
        })

        .text(function (d) {
            return d[0] + ":"
        })
        .append("svg:title")
            .text(function(d) { return d[2] })


    //x checkbox column
    var xBoxesLabel = d3.select("#x-checkboxes").append("div")
        .append("text")
        .attr("x", 10)
        .attr("y", 20)
        .text("X")
        .attr("class", "dosis teal-text");

    var xBoxes = d3.select("#x-checkboxes").selectAll("input")
        .data(attrList)
        .enter()
        .append("input")
        .attr("checked", function (d, i) {
            if (i == 0) return true;
        })
        .attr("type", "radio")
        .attr("name", "xBox")
        .attr("value", function (d, i) {
            return 'x' + i;
        })
        .attr("onClick", function (d, i) {
            return "updateDim(this)"
        });

    var yBoxesLabel = d3.select("#y-checkboxes").append("div")
        .append("text")
        .attr("x", 10)
        .attr("y", 20)
        .attr("class", "dosis teal-text")
        .text("Y");

    var yBoxes = d3.select("#y-checkboxes").selectAll("input")
        .data(attrList)
        .enter()
        .append("input")
        .attr("checked", function (d, i) {
            if (i == 0) return true;
        })
        .attr("name", "yBox")
        .attr("type", "radio")
        .attr("value", function (d, i) {
            return 'y' + i;
        })
        .attr("onClick", function (d, i) {
            return "updateDim(this)"
        });
    //.attr("onClick", "change(this)");


    //svg for overall scatterplot
    var overallSvg = d3.select("#age-breakdown-overall-results").append("svg")
        .attr("width", 403)
        .attr("height", 340);

    let instructions = overallSvg
        .append("text")
        .attr("x", 40)
        .attr("y", 40)
        .style("text-anchor", "left")
        .attr("class", "dosis purple-text instructions")
        .text("⇦ Select dimensions to generate graphs")
    //update function for scatterplots that runs whenever a new dimension is selected
    updateDim = function (hi) {
        selectionSvg.select(".title").remove()
        var sectionTitle = selectionSvg.append("text")
            .attr("x", w / 2-margin.left)
            .attr("y", 15)
            .style("text-anchor", "middle")
            .attr("pointer-events", "none")
            .attr("class", "title dosis teal-text")
            .text(function () {
                var ans = "Words for age"
                if (ageLower == ageUpper) {
                    return ans + " " + ageLower
                }
                return ans + "s " + ageLower + " to " + ageUpper
            });
        //get the dimension name
        xDimension = attrList[document.querySelector('input[name = "xBox"]:checked').value[1]][1];
        yDimension = attrList[document.querySelector('input[name = "yBox"]:checked').value[1]][1];

        console.log("ages " + ages[0] + " to " + ages[1])

        xScale = getScaleForRange("x", xDimension);
        yScale = getScaleForRange("y", yDimension);

        d3.selectAll(".scatterplot-point").remove()
        overallSvg.selectAll(".instructions").remove()

        //if one or fewer dimensions are selected, make a bar graph or nothing
        if (xDimension == "n/a" || yDimension == "n/a" || xDimension == yDimension) {
            //if exactly one dimension is selected, draw a bar graph with the accumulated values
            if (!(xDimension == "n/a" && yDimension == "n/a")) {

                //bar graph of size 8
                var barGraphValues = [];
                var domain = []
                var dimension = (xDimension == "n/a") ? yDimension : xDimension;
                let numDivisions=8;
                //fill bar graph values in with the x dimension or y dimension values accordingly
                domain = getDomain(dimension);
                let barDivisions = (+domain[1] - (+domain[0])) / numDivisions;
                // console.log(barDivisions);
                // console.log("Ages " + ageLower + " to " + ageUpper)
                data.filter(function (d) {
                    return (d.AoA >= ageLower) && (d.AoA <= ageUpper)
                }).forEach(function (d, i) {
                    let index = Math.ceil((+d[dimension] - domain[0]) / barDivisions);
                  //console.log(d[dimension]+"->"+index)
                    if (!barGraphValues[index]) {
                        barGraphValues[index] = 0
                    }

                    barGraphValues[index]++;
                })

                for (var i=0; i<numDivisions; i++) {
                  if(!barGraphValues[i]) { barGraphValues[i] = 0 }
                }
                barGraphValues.forEach(function(d,i) { if (!d) { barGraphValues[i]=0 }})
                //draw bar graph
                // barGraphValues = barGraphValues.filter(function (d) {
                //     return d != undefined
                // });
                console.log(barGraphValues)

                let cap = Math.max.apply(null, barGraphValues)
                console.log("cap: " + cap)
                let barGraphScale = d3.scaleLinear()
                    .domain([0, cap])
                    .range([0, scatterHeight]);
                var barGraph = overallSvg.selectAll("rect")
                    .data(barGraphValues)
                    .enter()
                    .append("rect")
                    .attr("x", function (d, i) {
                        return i * (scatterWidth - 60) / numDivisions + 60
                    })
                    .attr("y", function (d) {
                        return scatterHeight - barGraphScale(d)
                    })
                    .attr("width", (scatterWidth - 60) / numDivisions)
                    .attr("height", function (d) {
                        return barGraphScale(d)
                    })

                    .attr("class", "scatterplot-point")
                    .style("fill", "#7BB9D1")
                    .style("stroke", "white")
                    .style("stroke-width", 1)
                var barLabels = overallSvg.selectAll(".barGraphLabel")
                    .data(barGraphValues)
                    .enter()
                    .append("text")
                    .attr("x", function (d, i) {
                        return (i * (scatterWidth - 60) / numDivisions + 60) + 5
                    })
                    .attr("y", 320)
                    .attr("class", "scatterplot-point dosis purple-text")
                    .style("font-size", function(){ if(dimension=="Prevalence") { return "10px" } })
                    .text(function(d,i) {
                      var multiplier = 1
                      //to fix crowding issues, eliminate pre-decimal 0's from prevalence labels
                      if(dimension=="Prevalence") {
                        multiplier = 100
                        var a = Math.round(i*barDivisions*multiplier)/multiplier;
                        if(a<1&&a!=0) {
                          a=String(a).substring(1)
                        }
                        var b = Math.round((i+1)*barDivisions*multiplier)/multiplier;
                        if(b<1) {
                          b=String(b).substring(1)
                        }
                        return a + "-" + b
                      }
                      else if(dimension=="concreteness") {
                        multiplier = 10
                      }
                      return Math.round(i*barDivisions*multiplier)/multiplier + "-" + Math.round((i+1)*barDivisions*multiplier)/multiplier
                    })

                //axis stuff
                var yAxis = d3.axisLeft(barGraphScale.range([300, 0]))

                var y = overallSvg.append("g")
                    .call(yAxis)
                    .attr("transform", "translate(" + 60 + ",0)")
                    .attr("class", "scatterplot-point")
                    .style("pointer-events", "none");

                var xLabel = overallSvg
                    .append("text")
                    .attr("x", 520 / 2)
                    .attr("y", 340)
                    .attr("text-anchor", "middle")
                    .attr("class", "scatterplot-point dosis purple-text")
                    .text(dimension.charAt(0).toUpperCase()+dimension.slice(1))

                var yLabel = overallSvg
                    .append("text")
                    .style("text-anchor", "center")
                    .attr("x", -1 * height / 2 - 45)
                    .attr("y", 15)
                    .attr("transform", "rotate(270)")
                    .attr("class", "scatterplot-point dosis purple-text")
                    .text("# of Words");

            }
            //if 0 dimensions are selected, write some directions
            else {

              let instructions = overallSvg
                  .append("text")
                  .attr("x", 40)
                  .attr("y", 40)
                  .style("text-anchor", "left")
                  .attr("class", "dosis purple-text instructions")
                  .text("⇦ Select dimensions to generate graphs")

            }
        }
        //otherwise, scatterplot
        else {

            //set up axes
            var xAxis = d3.axisBottom(xScale)
            var x = overallSvg.append("g")
                .call(xAxis)
                .attr("transform", "translate(45," + 288 + ")")
                .attr("class", "scatterplot-point")
                //.style("font-size", "10pt")
                .style("pointer-events", "none");

            var yAxis = d3.axisLeft(yScale)
            //.ticks(7)
            var y = overallSvg.append("g")
                .call(yAxis)
                .attr("transform", "translate(" + 60 + ",3)")
                .attr("class", "scatterplot-point")
                //.style("font-size", "10pt")
                .style("pointer-events", "none");

            var xLabel = overallSvg
                .append("text")
                .attr("x", 520 / 2)
                .attr("y", 340)
                .attr("text-anchor", "middle")
                .attr("class", "scatterplot-point dosis")
                .text(xDimension.charAt(0).toUpperCase()+xDimension.slice(1))

            var yLabel = overallSvg
                .append("text")
                .style("text-anchor", "center")
                .attr("x", -1 * height / 2 - 45)
                .attr("y", 15)
                .attr("transform", "rotate(270)")
                .attr("class", "scatterplot-point dosis")
                .text(yDimension.charAt(0).toUpperCase()+yDimension.slice(1));


            //plot the scatterplot with both selected dimensions
            var overallCircles = overallSvg.selectAll("circle")
                .data(data.filter(function (d) {
                    return (d.AoA >= ageLower) && (d.AoA <= ageUpper)
                }))
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return xScale(d[xDimension]) + 45
                })
                .attr("cy", function (d) {
                    return yScale(d[yDimension])+3
                })
                .attr("r", function (d) {
                    return 2
                })
                .attr("class", "scatterplot-point")
                .style("fill", "#7BB9D1");

        }

        d3.selectAll(".trend-stuff").remove()

        let attrTrends = attributeTrends.append("svg")
            .attr("width", 500)
            .attr("height", scatterHeight)
            .attr("class", "trend-stuff")

        let lines = 3;

        if(xDimension!="n/a") {
          //print overall average
          var ct = 0;
          var sum = 0;

          data.forEach (function(d) {
            if(+d.AoA>=ageLower && +d.AoA<=ageUpper){
              sum+= (+d[xDimension])
              ct+=1
            }
          })
          let avg = sum/ct;

          attrTrends.append("text")
              .attr("x", 10)
              .attr("y", lines*20)
              .attr("class", "trend-stuff dosis teal-text")
              .text("Average value for " + xDimension + ": " + (Math.round(avg*100)/100))
          lines+=1
          if(ageLower!=ageUpper) {
            //get avg of lower age and upper age
            var ctLow = 0;
            var sumLow = 0;
            var ctHigh = 0;
            var sumHigh = 0;

            data.forEach (function(d) {
              if(+d.AoA==ageLower){
                sumLow+= (+d[xDimension])
                ctLow+=1
              }
              if(+d.AoA==ageUpper){
                sumHigh+= (+d[xDimension])
                ctHigh+=1
              }
            })
            let avgLow = sumLow/ctLow;
            let avgHigh = sumHigh/ctHigh;

            let change = avgHigh-avgLow;

            attrTrends.append("text")
                .attr("x", 10)
                .attr("y", lines*20)
                .attr("class", "trend-stuff dosis teal-text")
                .text(function() {
                  var txt = "Trend from " +ageLower+" to "+ageUpper + ": ";
                  txt+= (change>=0 ? "⇧ " :"⇩ ")
                  return txt+Math.abs(Math.round(change*100)/100)

                })
            lines+=1

          }
        }




        if(yDimension!="n/a") {
          //print overall average
          var ct = 0;
          var sum = 0;

          data.forEach (function(d) {
            if(+d.AoA>=ageLower && +d.AoA<=ageUpper){
              sum+= (+d[yDimension])
              ct+=1
            }
          })
          let avg = sum/ct;

          attrTrends.append("text")
              .attr("x", 10)
              .attr("y", (lines+1)*20)
              .attr("class", "trend-stuff dosis teal-text")
              .text("Average value for " + yDimension + ": " + (Math.round(avg*100)/100))
          lines+=1
          if(ageLower!=ageUpper) {
            //get avg of lower age and upper age
            var ctLow = 0;
            var sumLow = 0;
            var ctHigh = 0;
            var sumHigh = 0;

            data.forEach (function(d) {
              if(+d.AoA==ageLower){
                sumLow+= (+d[yDimension])
                ctLow+=1
              }
              if(+d.AoA==ageUpper){
                sumHigh+= (+d[yDimension])
                ctHigh+=1
              }
            })
            let avgLow = sumLow/ctLow;
            let avgHigh = sumHigh/ctHigh;

            let change = avgHigh-avgLow;

            attrTrends.append("text")
                .attr("x", 10)
                .attr("y", (lines+1)*20)
                .attr("class", "trend-stuff dosis teal-text")
                .text(function() {
                  var txt = "Trend from " +ageLower+" to "+ageUpper + ": ";
                  txt+= (change>=0 ? "⇧ " :"⇩ ")
                  return txt+Math.abs(Math.round(change*100)/100)

                })
            lines+=1

          }
        }




    }

}
