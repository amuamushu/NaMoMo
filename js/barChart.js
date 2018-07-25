function send_bar_request() {
    let xmlHttp = new XMLHttpRequest();
    console.log("sendind_request");
    xmlHttp.onreadystatechange =
        function() {
            if (xmlHttp.readyState === 4) {
                console.log("hi")
                let responseObject = JSON.parse(xmlHttp.responseText);
                console.log("hey")
                drawBarChart(responseObject);
            }
        };
    xmlHttp.open("GET", "/JSON", true);
    xmlHttp.send();
}

google.charts.load('current', {'packages':['corechart']});
//google.charts.setOnLoadCallback(send_request());
google.charts.setOnLoadCallback(() => {send_bar_request()});
// on load receive request and on response draw the graph



function drawBarChart(raw_bar_data) {
  // Create and populate the data table.
  console.log("hello")
  var data = google.visualization.arrayToDataTable(raw_bar_data['bar']);

  // Create and draw the visualization.
  new google.visualization.ColumnChart(document.getElementById('barchart')).
      draw(data,
           {title:"Energy Usage in a Month",
           backgroundColor: 'transparent',
           colors: ['#680e8e', '#8217b2', '#aa00f7', '#b154d8', '#c378e2', '#b98ccc'],
            width:600, height:400,
            vAxis: {title: "Energy (KW)"}, isStacked: true,
            hAxis: {title: "Month"}}
      );

}
