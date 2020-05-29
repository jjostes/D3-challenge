//I used Student Activity 16.3.09 as a template for this assignment

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//SVG wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import data
d3.csv("assets/data/data.csv").then(censusData => {
    console.log(censusData)

    //Parsing data as numbers
    censusData.forEach(data => {
      data.poverty = +data.poverty;
      data.smokes = +data.smokes;
    });

    //Scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(censusData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([9, d3.max(censusData, d => d.smokes)])
      .range([height, 0]);

    //Axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Appending axes to chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    //Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("class", "stateCircle")
    .attr("opacity", ".8");

    //State abbrevations - what would be the way to append these to the circle elements themselves?
    //    In order for the tooltip to work with the abbreviations as well
    chartGroup.selectAll("null").data(censusData)
    .enter()
    .append("text")
    .text(function(d){
      return d.abbr;})
    .attr("x",d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.smokes - .25))
    .attr("class", "stateText");

    //Tool tip (mouseover)
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Smokes: ${d.smokes}`);
      });

    chartGroup.call(toolTip);

    //Event listeners for tool tip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      //hiding tool tip
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    //Axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Smokes (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("Households in Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });