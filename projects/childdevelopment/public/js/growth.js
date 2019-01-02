//images from https://www.vectorstock.com/royalty-free-vector/people-male-and-female-aging-process-from-baby-to-vector-22462884, for educational purposes

//scatterplot with 1 main scatterplot showing words learned by age, 1 showing rate of vocab growth, and a side box showing stats for these words
function WordsByAge(dataInput) {
  let data = dataInput[2]

  //Select general graph div

  const totalDiv = d3.select("#chart-growth")
  const headerDiv = totalDiv.append("div")
      .style("display", "flex")
      .style("flex-flow", "row")
      .style("margin-bottom", "-40px")
      .style("margin-top", "20px")
  const headerA = headerDiv.append("h2")
      .style("margin-left", "270px")
      .attr("class", "dosis teal-text")
      .text("Words Learned by Age")

  const headerB = headerDiv.append("h2")
      .style("margin-left", "210px")
      .attr("class", "dosis teal-text")
      .text("Rate of Growth")

  const chartDiv = totalDiv.append("div")
      .attr("id", "chart-growth-inner")
  //chartDiv.attr("display", "flex")

  const wordsByAgeMain = chartDiv.append("div")
      .attr("id", "words-by-age-main")

  const sideDiv = chartDiv.append("div")
      .attr("id", "words-by-age-side")




  //text for each age's milestones
  // information from CDC, found at https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/middle2.html
  let ageMilestones = [
    {
      age: 2,
      text: [
        "Imitate the behavior of others",
        "Follow simple instructions",
        "Form simple phrases and sentences",
        "Desire to explore new objects and people",
        "Aware of themselves and their surroundings"
      ]
    },
    {
      age: 4,
      text: [
        "Sort objects by shape and color",
        "Can follow 2- or 3-step instructions",
        "Express a wide range of emotions"
      ]
    },
    {
      age: 6,
      text: [
        "Start attending school",
        "Begin to focus more on adults and children outside the family",
        "Want to explore and ask about things around them",
        "Ride a tricycle",
        "Use safety scissors",
        "Recall parts of a story"
      ]
    },
    {
      age: 8,
      text: [
        "Value independence",
        "Tie their own shoes",
        "Have less focus on oneself and more concern for others",
        "Want to be liked and accepted by friends"
      ]
    },
    {
      age: 10,
      text: [
        "Start to form more complex friendships",
        "Experience more peer pressure",
        "Face more academic challenges at school",
        "Have an increased attention span"
      ]
    },
    {
      age: 12,
      text: [
        "Become more aware of their bodies as puberty approaches",
        "Begin middle school",
        "Develop a stronger sense of right and wrong",
        "Experience more moodiness",
        "Show more interest in and influence by peer group"
      ]
    },
    {
      age: 13,
      text: [
        "Enter high school",
        "Show more concern about body image, looks, and clothes",
        "Face more serious peer pressure",
        "Make own decisions about friends, sports, studying, and school"
      ]
    },
    {
      age: 14,
      text: [
        "Feel stress from more challenging school work",
        "Can develop eating disorders or depression",
        "Go back and forth between high expectations and lack of confidence",
        "Express less affection toward parents"
      ]
    }
  ]

  function kidID(i) {
    return function() {
      if (i<4) {
        return i+1;
      }
      else if(i<=5) {
        return 5
      }
      else {
        return 6
      }
    }()

  }

  //shows the milestone data for the largest selected age
  function showMilestones(age) {
    d3.selectAll(".milestone").remove();
    let text = ageMilestones.filter( function(d) {return age==d.age})[0].text
    if(age>0) {
        d3.select("#words-by-age-main").select("svg")
          .append("text")
          .attr("x", 80)
          .attr("y", 50)
          .text("Age " + age + " Milestones")
          .style("text-decoration", "underline")
          .style("font-weight", "bold")
          .attr("class","milestone dosis teal-text");
        d3.select("#words-by-age-main").select("svg").selectAll(".milestone-text")
          .data(text)
          .enter()
          .append("text")
          .attr("x", 80)
          .attr("y", function(d,i) { return i*18+68 })
          .text(function(d,i) {  return "- " + d })
          .attr("class","milestone milestone-text dosis purple-text")
          .style("font-size", "12px");
    }
  }

  //make a kid smile :)
  function smile(i) {
    let trueKidID = kidID(i);
    d3.select("#image-"+trueKidID)
    .attr("xlink:href", "public/data/pictures/lifestage"+(trueKidID-1)+".png")
  }
  //make a kid unsmile, but that's not as fun :|
  function neutral(i) {
    let trueKidID = kidID(i);
    d3.select("#image-"+trueKidID)
    .attr("xlink:href", "public/data/pictures/lifestage"+(trueKidID-1)+"neutral.png")
  }

  var width = 600;
  var height = 400;
  var xMargin = 10;
  var yMargin = 30;

    let xScale = d3.scaleLinear()
      .domain([0,15])
      .range([xMargin, width-xMargin]);
    let yScale = d3.scaleLinear()
      .domain([0,26000])
      .range([height-yMargin, yMargin]);

  //  console.log(data)

    //get counts from 2 to 18 of how many words children has learned
    wordsByAgeArray = []
    cumulativeWordsByAgeArray = []
    cumulativeCount = 0

    //get the words learned by age
    for (i in data) {
      let AoA = +data[i].AoA

        if (wordsByAgeArray[AoA]==null) {
          wordsByAgeArray[AoA]=1
        }
        else {
          wordsByAgeArray[AoA]++
        }
    }


    //iterate through all ages, getting the cumulative
    for (var i=0; i<wordsByAgeArray.length; i++) {

      //plug 0's into slots without data
      if (wordsByAgeArray[i]==null) {
        cumulativeWordsByAgeArray[i]=[i,0]
      }
      //lowest age
      else if (i==2) {
        cumulativeCount+=wordsByAgeArray[i]
        cumulativeWordsByAgeArray[i]=[i,wordsByAgeArray[i]]
      }
      //add current age's stuff, and if not
      else {
        var j=1
        while(cumulativeWordsByAgeArray[i-j][1]==0) {
          j++
        }
        cumulativeWordsByAgeArray[i]=[i,wordsByAgeArray[i]+cumulativeWordsByAgeArray[i-j][1]]
      }
    }

    console.log(cumulativeWordsByAgeArray)
    wordsByAgeSide = new WordsByAgeSide(data,cumulativeWordsByAgeArray.filter(count=>count[1]>0))
console.log("HERE")
    var svg = d3.select("#words-by-age-main").append("svg")
    .attr("width", width+15)
    .attr("height", height)


    var adultWordsKnown = d3.select("#words-by-age-main").select("svg").append("line")
          .attr("x1", 50)
          .attr("y1", yScale(42000))
          .attr("x2", xScale(16))
          .attr("y2", yScale(42000))
          .style("stroke", "black")
          .style("stroke-width", 1)
          .style("stroke-dasharray", ("3, 3"))
    var adultWordsKnownLabel = d3.select("#words-by-age-main").select("svg").append("text")
          .attr("x", xScale(14))
          .attr("y", yScale(42200))
          .style("text-anchor","end")
          .style("font-size", "8pt")
          .attr("class", "dosis")
          .text("Avg adult vocabulary: 42000 words")

    //--------BRUSH STUFF--------//
    const brush = d3.brushX()
      .extent([[59, 30], [width+10, height-33]])
      //.style("transform", "scale(20)")
      .on("brush", function() {
      var extent = d3.event.target.extent()
      node.classed("selected", function(d) {
        return extent[0] <= d.x && d.x < extent[1] });
   })
      .on('end', brushed);
    const gBrush = svg.append('g')
      .attr('class', 'brush')
      .call(brush);

    //plot the thing

    //connect the dots, lalalala
    var valueline = d3.line()
        .x(function(d) { return xScale(+d[0])+45; })
        .y(function(d) { return yScale(+d[1]); });

      // Add the valueline path.
    svg.append("path")
        .data(function() { return [cumulativeWordsByAgeArray.filter(function(d) {
          // console.log(d[1])
          return (d[0]==0 || d[1]>0 )
        })]})
        .attr("class", "line scatterplot-line")
        .attr("d", valueline)
        // .style("fill", "none")
        // .style("stroke-width",1)
        // .style("stroke","black");

        var img = d3.select("#words-by-age-main").select("svg").selectAll("svg")
            .data(function() { return cumulativeWordsByAgeArray.filter(function(d) {
              return (d[1] > 0 && d[0] < 14)
            })})
            .enter()
            .append("svg:image")
            .attr("x", function(d,i) { return xScale(i*2)+45 })
            .attr("y", function(d,i) { if(i==6) {return yScale(d[1]-2)-2};return yScale(d[1]-2)+20 })
            .attr("id", function(d,i) { return "image-"+i })
            .attr("xlink:href", function(d,i) { return "public/data/pictures/lifestage"+(i-1)+"neutral.png"})
            .attr("pointer-events","none")



        var circle = d3.select("#words-by-age-main").select("svg").selectAll("circle")
              //.data(cumulativeWordsByAgeArray)
              .data(function() { return cumulativeWordsByAgeArray.filter(function(d) {
                return (d[1] > 0)
              })})
              .enter()
              .append("circle")
              .attr("cx", function(d) { return xScale(d[0])+45 })
              .attr("cy", function(d) { return yScale(d[1]) })
              .attr("r", function(d) { return d[1]>0?7:0})
              .attr("class", "age-data color-secondary-2-3")
              .on("mouseover", function(d,i) {
                smile(i)
                let xPos = this.cx.baseVal.value-110
                let yPos = this.cy.baseVal.value
                let line1 = "Age: " + d[0]
                let line2 = "Words: " + d[1]

                svg.append("rect")
                    .attr("x", xPos)
                    .attr("y", yPos)
                    .attr("height",50)
                    .attr("width", 110)
                    .attr("class", "wbaTT tt-box")
                    .attr("pointer-events","none")
                svg.append("text")
                    .attr("x", xPos+5)
                    .attr("y", yPos+20)
                    .attr("class","wbaTT dosis tt-text")
                    .text(line1)
                svg.append("text")
                    .attr("x", xPos+5)
                    .attr("y", yPos+40)
                    .attr("class","wbaTT dosis tt-text")
                    .text(line2)
              })
              .on("mouseout", function(d,i) {
                d3.selectAll(".wbaTT").remove()
                neutral(i)
              } );

    //set up axes
    var xAxis = d3.axisBottom(xScale)
      //.ticks(16)
    var x = svg.append("g")
      .call(xAxis)
      .attr("transform", "translate(45," + (height-30) + ")")
      //.style("font-size", "10pt")
      .style("pointer-events", "none")
      .attr("class", "color-primary-0 rounded-edges");

    var yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.formatPrefix("0.0", 1e5))
      //.ticks(7)
    var y = svg.append("g")
      .call(yAxis)
      .attr("transform", "translate(" + 55 + ",0)")
      //.style("font-size", "10pt")
      .style("pointer-events", "none")
      .attr("class", "color-primary-0 rounded-edges");

    var xLabel = d3.select("#words-by-age-main").select("svg")
        .append("text")
        .attr("x", width/2)
        .attr("y", height-5)
        .text("Age")
        .attr("class", "purple-text dosis");

    var yLabel = d3.select("#words-by-age-main").select("svg")
        .append("text")
        .style("text-anchor", "center")
        .attr("x",-1*height/2-45)
        .attr("y",15)
        .attr("transform", "rotate(270)" )
        .text("Words Known")
        .attr("class", "purple-text dosis");

        function brushed () {
          var e = d3.event.selection
          //svg.selectAll(".age-data").attr("class", "scatterplot-line")
          // for (node in e) {
          //   console.log(node)
          //   node.style("fill", "green")
          // }
          var selected = svg.selectAll(".age-data").filter(function(d) {
            if(e==null) {
              d3.select(this).attr("class", "age-data color-secondary-2-3");
              return false;
            }
            if ((d3.select(this).attr("cx") <= e[1]) && (d3.select(this).attr("cx") >= e[0])) {
                d3.select(this).attr("class", "age-data color-secondary-2-3");
                return true;
            }
            else {
              d3.select(this).attr("class", "age-data color-secondary-2-1");
              return false;
            }
          });

            //upper end of range
            showMilestones(parseInt(selected.data()[selected.data().length-1]))
          //}

       wordsByAgeSide.update([parseInt(selected.data()[0]), parseInt(selected.data()[selected.data().length-1])]);

      }






}
