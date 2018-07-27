function send_pie_request(month) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange =
        function() {
            if (xmlHttp.readyState === 4) {
                let responseObject = JSON.parse(xmlHttp.responseText);
                drawPieChart(responseObject);
            }
        };
    xmlHttp.open("GET", "/JSONmain?month=" + month, true);
    xmlHttp.send();
}

//gets month from main.html
document.getElementById("changeMonth").addEventListener("click", function(){
    let month = document.getElementById("monthlist").value;
    send_pie_request(month);
});

google.charts.load('current', {'packages':['corechart']});

//default month is July
google.charts.setOnLoadCallback(() => {send_pie_request("July")});

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

  //TIPS
  var heatingTips = ["Install a programmable thermostat to save up to 10% on cooling and heating costs",
    "Use your window shades. Close blinds on the sunny side in summer to keep out the hot sun, and open them in winter to bring in warm rays.",
    "Seal air leaks and properly insulate to save up to 20% on heating and cooling bills",
    "Reduce water heater temperature to 130° F to save energy and money on heating water; and wrap the water storage tank in a specially-designed “blanket” to retain the heat."];
  var coolingTips = ["Clean or change filters regularly. A dirty A/C filter will slow down air flow and make the system work harder to keep you warm or cool.",
    "Install a programmable thermostat to save up to 10% on cooling and heating costs", "Invest in blackout curtains to naturally insulate a room",
    "Swap your bedding with cotton ones during the summer. Cotton breathes easier and stays cooler",
    "Heat rises so put your mattress on the floor or sleep on a lower floor"];
  var lightingTips = ["Change to new and improved light bulbs. Reduce energy use from about a third to as much as 80% with today’s increasing number of energy-efficient halogen incandescents, CFLs and LEDs.",
    "Install dimmers to reduce the amount of electricity a light uses and increases the life of low-voltage lighting such as halogen downlights.",
    "Use an electrical lamp to give you ample light at a lower cost than an overhead light",
    "Keep lightbulbs dustfree and lampshades clean to prevent light from gettin obstructed."];
  var applianceTips = ["Wash clothes in cold water to save $63 a year", "Turn off all lights, appliances and electronics not in use. A power strip can help turn off multiple items at once.",
    "Replace inefficient appliances with ENERGY STAR® models. ENERGY STAR appliances use 10-20% less energy than standard appliances. This helps save money and the environment.",
    "Always wash a full load in the washing machine. Washing one full load will use less energy than washing two smaller loads.", "Cool down hot foods before placing them in the fridge or freezer.",
    "Instead of using a screen saver, turn your monitor off when you walk away from your computer. With a screen saver running, your monitor is still using full power."];
  var tipsList = "";
//creates an array of the inputs of one entry
  var oneEntry = [];
  for (a = 1; a < 5; a++){
    oneEntry.push(raw_pie_data['pie'][a][1]);
  }
  //finds the max input in one entry
  var maxOneEntry = Math.max.apply(null, oneEntry);
  //sees which item in one entry that the max value equals to
  if (raw_pie_data['pie'][1][1] === maxOneEntry){ //change the first one in array to get heat/cool/light
    document.getElementById("pietips").innerHTML= "Tips for Heating Energy Usage!";
    document.getElementById("piediff").innerHTML= "Wowzers! You used " + raw_pie_data['pie'][1][1] + " kilowatt hours of energy for heating. Here are some helpful tips to help you save on heating.";
    listTips(heatingTips);
  } else if (raw_pie_data['pie'][2][1] === maxOneEntry) {
    document.getElementById("pietips").innerHTML= "Tips for Cooling Energy Usage!";
    document.getElementById("piediff").innerHTML= "Oh snap! You used " + raw_pie_data['pie'][2][1] + " kilowatt hours of energy for cooling. Here are some helpful tips to help you save on cooling.";
    listTips(coolingTips);
  } else if (raw_pie_data['pie'][3][1] === maxOneEntry) {
    document.getElementById("pietips").innerHTML= "Tips for Lighting Energy Usage!";
    document.getElementById("piediff").innerHTML= "Wowzers! You used " + raw_pie_data['pie'][3][1] + " kilowatt hours of energy for lighting. Here are some helpful tips to help you save on lighting.";
    listTips(lightingTips);
  } else if (raw_pie_data['pie'][4][1] === maxOneEntry) {
    document.getElementById("pietips").innerHTML= "Tips for Appliance Energy Usage!";
    document.getElementById("piediff").innerHTML= "Woah! You used " + raw_pie_data['pie'][4][1] + " kilowatt hours of energy for appliances. Here are some helpful tips to help you save on appliance usage.";
    listTips(applianceTips);
  }
}

function listTips(category){
  for (var a = 0; a < (category.length); a++) {
      tipsList = "<li>" + (category[a]) + "</li>";
      document.getElementById("pielist").innerHTML += tipsList;
  }
}
