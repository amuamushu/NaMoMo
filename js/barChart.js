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
           colors: ['#680e8e', '#8217b2', '#aa00f7', '#b154d8', '#c378e2', '#b98ccc'], //goes from dark to light
            width:600, height:400,
            vAxis: {title: "Energy (KW)"}, isStacked: true,
            hAxis: {title: "Month"}}
      );

  //TIPS    
  //gets the most recent total for the bar graph
  let mostRecentTotal =0;
  for (i = 1; i < raw_bar_data['bar'][1].length-1; i++){
    mostRecentTotal += raw_bar_data['bar'][raw_bar_data['bar'].length-1][i];
  }
  //gets the total of the second most recent input
  let previousTotal = 0;
  for (i = 1; i < raw_bar_data['bar'][1].length-1; i++){
    previousTotal += raw_bar_data['bar'][raw_bar_data['bar'].length-2][i];
  }

  if (mostRecentTotal > previousTotal) {
    //states difference between most recent and previous total
    document.getElementById("bardiff").innerHTML= "You have used " + (mostRecentTotal - previousTotal) +
    " more Kilowatts of energy than last month. Oh no!"
  } else if (mostRecentTotal < previousTotal) {
    document.getElementById("bardiff").innerHTML= "You have used " + (previousTotal - mostRecentTotal) + " less Kilowatts of energy than last month! Woohoo!"
  }
  //document.getElementById("bartips").innerHTML= mostRecentTotal + ", " + previousTotal;
}

/*
*/
