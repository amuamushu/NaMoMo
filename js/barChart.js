
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawBarChart);

function drawBarChart() {
  // Create and populate the data table.
  var data = google.visualization.arrayToDataTable([
       ['Energy Usage', 'Heating', 'Water Heating', 'Cooling', 'Lights',
        'Appliance', 'Electronics', { role: 'annotation' } ],
       ['January', 10, 24, 20, 32, 18, 5, ''],
       ['February', 16, 22, 23, 30, 16, 9, ''],
       ['March', 28, 19, 29, 30, 12, 13, '']
     ]);

  // Create and draw the visualization.
  new google.visualization.ColumnChart(document.getElementById('barchart')).
      draw(data,
           {title:"Energy Usage in a Month",
            width:600, height:400,
            vAxis: {title: "Energy (KW)"}, isStacked: true,
            hAxis: {title: "Month"}}
      );
}
