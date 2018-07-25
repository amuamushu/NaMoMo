

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
  var options = {'title':'Energy Usage in a Month', 'width':400, 'height':300};

  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data, options);
}
