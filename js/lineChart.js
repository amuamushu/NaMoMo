function send_line_request(type) {
    let xmlHttp = new XMLHttpRequest();
    console.log("sendind_request1");
    xmlHttp.onreadystatechange =
        function() {
            if (xmlHttp.readyState === 4) {
                let responseObject = JSON.parse(xmlHttp.responseText);
                console.log("test")
                drawLineChart(responseObject);
            }
        };
    xmlHttp.open("GET", "/JSONmain?type=" + type, true);
    xmlHttp.send();
}

document.getElementById("changeType").addEventListener("click", function(){
    let type = document.getElementById("type_list").value;
    send_line_request(type);
});

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(() => {send_line_request("heating_usage")});
// draws the line chart
      function drawLineChart(raw_line_data) {
        var data = google.visualization.arrayToDataTable(raw_line_data['line']);

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
