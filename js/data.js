var data = [
    {month: 'Jan', Heating: 408, WaterHeating: 183, Cooling: 183, Lights:169, Appliance: 169, Electronics: 295},
    {month: 'Feb', Heating: 408, WaterHeating: 183, Cooling: 234, Lights:657, Appliance: 169, Electronics: 295},
    {month: 'March', Heating: 324, WaterHeating: 324, Cooling: 183, Lights:169, Appliance: 576, Electronics: 295},
    {month: 'April', Heating: 243, WaterHeating: 564, Cooling: 233, Lights:169, Appliance: 169, Electronics: 809},
    {month: 'May', Heating: 33, WaterHeating: 32, Cooling: 183, Lights:798, Appliance: 169, Electronics: 295},
    {month: 'June', Heating: 99, WaterHeating: 435, Cooling: 123, Lights:890, Appliance: 169, Electronics: 567,}
];

var xData = ["Heating", "WaterHeating", "Cooling", "Lights", "Appliance", "Electronics"];

var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .35);

var y = d3.scale.linear()
        .rangeRound([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataIntermediate = xData.map(function (c) {
    return data.map(function (d) {
        return {x: d.month, y: d[c]};
    });
});

var dataStackLayout = d3.layout.stack()(dataIntermediate);

x.domain(dataStackLayout[0].map(function (d) {
    return d.x;
}));

y.domain([0,
    d3.max(dataStackLayout[dataStackLayout.length - 1],
            function (d) { return d.y0 + d.y;})
    ])
  .nice();

var layer = svg.selectAll(".stack")
        .data(dataStackLayout)
        .enter().append("g")
        .attr("class", "stack")
        .style("fill", function (d, i) {
            return color(i);
        });

layer.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function (d) {
            return x(d.x);
        })
        .attr("y", function (d) {
            return y(d.y + d.y0);
        })
        .attr("height", function (d) {
            return y(d.y0) - y(d.y + d.y0);
        })
        .attr("width", x.rangeBand());

svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
  
