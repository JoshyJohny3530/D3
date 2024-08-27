document.addEventListener("DOMContentLoaded", () => {
  const width = 960;
  const height = 600;

  const svg = d3
    .select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const projection = d3
    .geoMercator()
    .scale(130)
    .translate([width / 2, height / 1.5]);
  const path = d3.geoPath().projection(projection);

  const tooltip = d3.select(".tooltip");

  d3.json("../data/worldgeo.json").then((worldData) => {
    d3.csv("../data/covid_data.csv").then((covidData) => {
      const covidMap = new Map();
      covidData.forEach((d) => {
        covidMap.set(d["Country"], {
          confirmed: +d.Confirmed,
          deaths: +d.Deaths,
          recovered: +d.Recovered,
        });
      });

      function updateMap(dataType) {
        const colorScale = d3
          .scaleThreshold()
          .domain([10000, 50000])
          .range(["yellow", "green", "red"]);

        svg
          .selectAll("path")
          .data(worldData.features)
          .join("path")
          .attr("d", path)
          .attr("fill", (d) => {
            const countryData = covidMap.get(d.properties.name);
            const value = countryData ? countryData[dataType] : 0;
            return value ? colorScale(value) : "cyan";
          })
          .attr("stroke", "#333")
          .on("mouseover", function (event, d) {
            const countryData = covidMap.get(d.properties.name);
            tooltip.transition().duration(200).style("opacity", 0.9);
            if (countryData) {
              tooltip
                .html(
                  `${d.properties.name}<br>${dataType}: ${countryData[dataType]}`
                )
                .style("left", event.pageX + 5 + "px")
                .style("top", event.pageY - 28 + "px");
            } else {
              tooltip
                .html(`${d.properties.name}<br>No Data`)
                .style("left", event.pageX + 5 + "px")
                .style("top", event.pageY - 28 + "px");
            }
          })
          .on("mouseout", function () {
            tooltip.transition().duration(500).style("opacity", 0);
          });
      }

      updateMap("confirmed");

      d3.select("#data-type").on("change", function () {
        const selectedType = this.value;
        updateMap(selectedType);
      });

      const legend = d3
        .select("#legend")
        .append("svg")
        .attr("width", 500)
        .attr("height", 50);

      const legendData = [
        { color: "yellow", label: "< 10,000" },
        { color: "green", label: "10,000 - 50,000" },
        { color: "red", label: "> 50,000" },
        { color: "cyan", label: "No Data" },
      ];

      legend
        .selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 130)
        .attr("y", 10)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", (d) => d.color);

      legend
        .selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * 130 + 35)
        .attr("y", 25)
        .text((d) => d.label)
        .style("font-size", "12px")
        .style("margin", "10px")
        .attr("alignment-baseline", "middle");
    });
  });
});
