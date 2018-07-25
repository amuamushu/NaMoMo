function send_pie_request() {
    let xmlHttp = new XMLHttpRequest();
    console.log("sendind_request1");
    xmlHttp.onreadystatechange =
        function() {
            if (xmlHttp.readyState === 4) {
                let responseObject = JSON.parse(xmlHttp.responseText);
                console.log("test")
                drawPieChart(responseObject);
            }
        };
    xmlHttp.open("GET", "/JSON", true);
    xmlHttp.send();
}


google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(() => {send_pie_request()});

// Draw the chart and set the chart values
function drawPieChart(raw_pie_data) {
  var data = google.visualization.arrayToDataTable(raw_pie_data['pie']);

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
