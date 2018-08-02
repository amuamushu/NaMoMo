function send_update_request(logNumber) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    }
  };
  let stringDate = String(logNumber);
  let month  = stringDate.slice(4,6);
  let year = stringDate.slice(0,4);
  let day = stringDate.slice(6,8);
  let date = year + "-" + month + "-" + day;
  console.log(date);
  xmlhttp.open("GET", "/delete?date=" + date, true);
  xmlhttp.send();
}
