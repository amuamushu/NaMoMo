
google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawLineChart);
// draws the line chart
      function drawLineChart() {
        var data = google.visualization.arrayToDataTable([
          ['Month', 'Energy Usage (KW)'],
          ['January', 400],
          ['Feburary', 460],
          ['March', 1120],
          ['April', 540]
        ]);

        var options = {
          title: 'Energy Usage',
             backgroundColor: 'transparent',
             colors: ['#7851a9'],
             'width': 1000,
             'height': 750,
          //curveType: 'function', <-- made graph curvy
          legend: { position: 'top' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('linechart'));

        chart.draw(data, options);
      }
