var fileInput = document.getElementById("csv"), readFile;
var data;
var keyobj;
var chartdata = [0, 0];

var ctx = document.getElementById("myChart").getContext('2d');

var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Supported", "Total"],
        datasets: [{
            label: '# of things',
            data: chartdata,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

function updatePage() {
    updateTableAndCount()
    percentCalc()
    myChart.update()
}

function readFile() {
    var reader = new FileReader();
    reader.onload = function () {
        keyobj = {}
        data = $.csv.toObjects(reader.result)
        countTotal()
        updateKey()
        updatePage()
    };
    // start reading the file. When it is done, calls the onload event defined above.
    reader.readAsBinaryString(fileInput.files[0]);
};

function updateKey() {
    var key = '';
    for (var item in data[0]) {
        //ignore metadata rows
        keyobj[item] = 1;
        if (data[0][item] == 'True' || data[0][item] == 'False') {
            key += '<input type="checkbox" name="' + item + '" value="' + item + '" checked> '
            key += item + "<br>\r\n"
        }

    }
    document.getElementById('key').innerHTML = key
}

function percentCalc() {
    document.getElementById('percent').innerHTML = ((chartdata[0] / chartdata[1]) * 100).toFixed(2) + "%"
}

function countTotal() {
    chartdata[1] = data.length
    return (data.length)
}

function updateTableAndCount() {
    var table = '';
    var count = 0;
    table += '<tr>\r\n';
    for (var header in keyobj) {
        table += '<th>' + header + '</th>\r\n';
    }
    table += '</tr>\r\n'
    for (var row in data) {
        var isgood = true;
        //check if row is good or not
        for (var item in keyobj) {
            if (keyobj[item] == 0 && data[row][item] == 'True') {
                isgood = false;
                break;
            }
        }

        //style table based on row being good
        if (isgood) {
            count += 1;
            table += '<tr class="alert-success">\r\n';
        }
        else {
            table += '<tr">\r\n';
        }
        for (var item in data[row]) {
            table += '<td>' + data[row][item] + '</td>\r\n';
        }
        table += '</tr>\r\n';
    }
    chartdata[0] = count;
    document.getElementById('out').innerHTML = table;
};

fileInput.addEventListener('change', readFile);

$(document).on('change', '#key input[type=checkbox]', function () {
    if ($(this).is(':checked')) {
        keyobj[$(this).attr('name')] = 1;
    }
    else {
        keyobj[$(this).attr('name')] = 0;
    }
    updatePage()
})

//Old Functions, not used
function countProgress() {
    var count = 0;
    var isgood = true;
    for (var row in data) {
        for (var item in keyobj) {
            if (keyobj[item] == 0 && data[row][item] == 'True') {
                isgood = false;
                break;
            }
        }
        if (isgood) {
            count += 1;
        }

    }
    chartdata[0] = count;
}

function updateTable() {
    var table = '';
    table += '<tr>\r\n';
    for (var header in keyobj) {
        table += '<th>' + header + '</th>\r\n';
    }
    table += '</tr>\r\n'
    for (var row in data) {
        table += '<tr>\r\n';
        for (var item in data[row]) {
            table += '<td>' + data[row][item] + '</td>\r\n';
        }
        table += '</tr>\r\n';
    }
    document.getElementById('out').innerHTML = table;
};

function updateSelected() {
    var out = '';
    for (var item in keyobj) {
        out += item + ": " + keyobj[item] + "<br>\r\n"
    }
    document.getElementById('selected').innerHTML = out
}