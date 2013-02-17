var n = parseInt(prompt("N = ?", "Enter n here"));
console.log(n + 1);

var root = document.getElementById('table');
var table = document.createElement('table');
var tbody = document.createElement('tbody');
var row, cell;
for (var i = 0; i < n; i++)
{
	row = document.createElement('tr');
	for (var j = 0; j < n; j++) {
		cell = document.createElement('td');
		//cell.appendChild(document.createTextNode(j));
		row.appendChild(cell);
	}
	tbody.appendChild(row);
}

table.appendChild(tbody);
root.appendChild(table);