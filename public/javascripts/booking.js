//  set seat from reservationArray before render Table
table = document.getElementById("myTable" + $("#tableToken").val());

// Change to string to Array
if ($("#reservationTrip").val() === null || $("#reservationTrip").val() === undefined || $("#reservationTrip").val() === '')
  reservationArray = [];
else {
  let reservationString = $("#reservationTrip").val();
  reservationArray = reservationString.split(",");
}

// Set seat not available

reservationArray.forEach(element => {
  if (element !== null && element !== undefined && element !== '') {
    let pos = getPositionTable(element);
    table.rows[pos.AValue].cells[pos.BValue].style = "background-color: red";
  }
});
// Handle click a Seat

function myFunction(x) {
  let tr = x.parentNode.rowIndex;
  let td = x.cellIndex;
  let id = $("#idTrip").val();
  let stringPos = "A" + tr + "B" + td;
  let result = "";
  if (
    table.rows[tr].cells[td].innerHTML === "" ||
    table.rows[tr].cells[td].innerHTML ===
    '<i class="fas fa-user-circle"></i>' ||
    table.rows[tr].cells[td].style["background-color"] === "red"
  ) {
    return;
  }
  if (reservationArray.indexOf(stringPos) !== -1 && table.rows[tr].cells[td].style["background-color"] !== "green") {
    return;
  }
  if (table.rows[tr].cells[td].style["background-color"] === "green") {
    table.rows[tr].cells[td].style = "background-color: unset;";
    let pos = reservationArray.indexOf(stringPos);
    let curPos = currentReservationArray.indexOf(stringPos);
    if (pos !== -1)
      reservationArray.splice(pos, 1);
    if(curPos !== -1)
      currentReservationArray.splice(curPos, 1);
  } else {
    table.rows[tr].cells[td].style = "background-color: green;";
    result = "A" + tr + "B" + td;
    if (result !== "")
      reservationArray.push(result);
      currentReservationArray.push(result);
  }
}

function checkArray() {
  console.log(reservationArray);
}

function getPositionTable(s) {
  let Bpos = s.indexOf("B");
  let A = parseInt(s.slice(0 + 1, Bpos));
  let B = parseInt(s.slice(Bpos + 1, s.length));
  return { AValue: A, BValue: B };
}

function bookTicket() {
  let payload = { id: $("#idTrip").val(), currentReservations: currentReservationArray, reservations: reservationArray ,agency: $("#idAgency").val()};
      $.ajax({
      type: 'POST',
      url: "/getPayment",
      data: payload
    }).done(function (data) {
      window.location.href = "/payment";
    }).fail(function (data) {
      console.log(data);
    }); 
}