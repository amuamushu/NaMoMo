

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawPieChart);

// Draw the chart and set the chart values
function drawPieChart() {
  var data = google.visualization.arrayToDataTable([
  ['Energy Usage', 'Amount'],
  ['Heating', 8],
  ['Water Heating', 2],
  ['Cooling', 2],
  ['Lights', 3],
  ['Appliance', 2],
  ['Electronics', 7]
]);

  // Optional; add a title and set the width and height of the chart
  var options = {
      'title':'Energy Usage in a Month',
      backgroundColor: 'transparent',
      pieSliceTextStyle: {
            color: 'black',
          },
      colors: ['#680e8e', '#8217b2', '#aa00f7', '#b154d8', '#c378e2', '#b98ccc'],
      'width': 1000,
      'height': 750};
  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data, options);
}
