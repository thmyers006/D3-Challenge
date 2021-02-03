// code to create the SVG canvas for visualization
var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter") 
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets//js//data.csv").then(function(stateData) {
    console.log(stateData);

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(stateData) {
      stateData.poverty = +stateData.poverty;
      stateData.age = +stateData.age;
      stateData.income = +stateData.income;
      stateData.smokes = +stateData.smokes;
      });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(stateData, s => s.smokes)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([28, d3.max(stateData, s => s.age)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create tooltip in the chart
    // ===============================
      var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(s) {
          return (`${s.state}<br> Percentage of Smokers: ${s.smokes}<br>Average Age: ${s.age}`);
          });       
    
    chartGroup.call(toolTip);


    // Step 6: Create axes labels
    // ===============================
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Average Age");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Percentage of Smokers");
  
    // Step 7: Create Circles with Event Listeners
    // ================================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", s => xLinearScale(s.smokes))
      .attr("cy", s => yLinearScale(s.age))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", ".5")
      .on("mouseover", function(d) {
          toolTip.show(d, this);
          //console.log("mouseover", d)
      })
      .on("mouseout", function(d) {
        toolTip.hide(d);
      })

    // Step 8: Create text to identify circles with Event Listeners
    // =================================
    var textGroup = chartGroup.selectAll("rect")
      .data(stateData)
      .enter()
      .append("text")
      .attr("x", s => xLinearScale(s.smokes) - 10)
      .attr("y", s => yLinearScale(s.age) + 5)
      .style("fill", "black")
      .text(function(s) {
          return `${s.abbr}`;
          })
      .on("mouseover", function(d) {
            toolTip.show(d, this);
           // console.log("mouseover", d)
        })
      .on("mouseout", function(d) {
          toolTip.hide(d);
        })

}).catch(function(error) {
        console.log(error);
});  