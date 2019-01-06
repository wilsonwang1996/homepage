// function Navigation() {
//     //Set up navigation div stats
//     const navigationDivStat =
//     //Define navigation div stats
//     let navigationDiv = d3.select("#header-navigation")
//         .style("position", "relative")
//         .style("height", "50%")
//         .style("background-color", "#2F7F9E");
//
//
//     //Set up navigation bar
//     const buttonOptions = ["Home", "Resume", "Projects", "About"];
//     //Define button styles
//     let buttonStyle = {
//         width: 70,
//         height: 30,
//         leftSpace: 70,
//         topSpace: 30,
//         padding: 200,
//     };
//     //Create button objects
//     let navigationButtons = navigationDiv
//         .selectAll(".nav-option")
//         .data(buttonOptions)
//         .enter()
//         .append("button")
//         .attr("class", "nav-option")
//         .text(function (d) {
//             return d
//         })
//         .style("width", function () {
//             return buttonStyle.width + "px";
//         })
//         .style("height", function () {
//             return buttonStyle.height + "px";
//         })
//         .style("top", function () {
//             return buttonStyle.topSpace + "px";
//         })
//         .style("left", function (d, i) {
//             return buttonStyle.leftSpace + buttonStyle.padding * i + "px";
//         });
// }