// Set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 70, left: 100},
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("data.csv").then(data => {

  // Add X axis
  const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(d => d.Country))
    .padding(0.2);
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .attr("class", "axis-label");

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.Population)])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
      .attr("class", "axis-label");

  // Bars
  svg.selectAll("mybar")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.Country))
    .attr("y", d => y(d.Population))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.Population))
    .attr("class", "bar")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", "#21a1f1");
      const [x, y] = d3.pointer(event);
      const tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("left", `${x + margin.left + 15}px`)
        .style("top", `${y + margin.top + 15}px`)
        .html(`<strong>${d.Country}</strong><br>Population: ${d.Population}`);
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", "#61dafb");
      d3.select("#tooltip").remove();
    });
});
