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
        calculateFeatureOrder()
        updatePage()
    };
    // start reading the file. When it is done, calls the onload event defined above.
    reader.readAsBinaryString(fileInput.files[0]);
};

function updateKey() {
    var key = '';
    key += '<a href="javascript:;" onClick="select_all()">Select All</a> | <a href="javascript:;" onClick="select_none()">Select None</a><br>'
    for (var item in data[0]) {
        //ignore metadata rows
        if (data[0][item] == 'True' || data[0][item] == 'False') {
            keyobj[item] = 1;
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
    for (var header in data[0]) {
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
            table += '<tr class="table-success">\r\n';
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

function calculateFeatureOrder() {
    //This function will go through each key, and figure out which one has the smallest number of dependent rows
    //it will then remove those rows and key from the list, and repeat till there are no keys
    //we keep track of the order in which we remove the keys which then gives us a feature order
    var datacopy = data.slice()
    var keytracker = [];
    for (var item in keyobj) {
        //First element is the coloumn/key name, second element is count
        keytracker.push([item, 0])
    }
    var keyorder = [];
    while (keytracker.length > 0) {
        for (var n in keytracker) {
            for (var row in datacopy) {
                var item = keytracker[n][0];
                if (datacopy[row][item] == 'True') {
                    //this is keeping a count of items
                    keytracker[n][1] += 1;
                }
            }
        }
        //sort by smallest number of items
        keytracker.sort(compareSecondCol)
        //add smallest to order first
        keyorder.push(keytracker[0][0])
        //remove all rows with that requirement since we are doing it "last"
        for (var row in datacopy) {
            if (datacopy[row][keytracker[0][0]] == 'True') {
                datacopy.splice(row, 1)
            }
        }
        //remove that item from the tracker
        keytracker.splice(0, 1)
    }
    var html = "<h4>Suggested Feature Order</h4>\r\n"
    html += "<ol>\r\n"
    keyorder.reverse()
    for (var item in keyorder) {
        html += "<li>" + keyorder[item] + "</li>\r\n"
    }
    html += "</ol>\r\n"
    //commenting out the alternate feature order
    /*
    var keyorder2 = calculateFeatureOrder2()
    html += "<h4>Alternate Feature Order</h4>\r\n"
    html += "<ol>\r\n"
    for (var item in keyorder2) {
        alert(keyorder2[item][0])
        html += "<li>" + keyorder2[item][0] + "</li>\r\n"
    }
    html += "</ol>\r\n"
    */
    document.getElementById('featureOrder').innerHTML = html;
}

function compareSecondCol(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

function select_all() {
    $('#key input[type=checkbox]').each(function () {
        $(this).attr('checked', true)
        keyobj[$(this).attr('name')] = 1
    })
    updatePage()
}

function select_none() {
    $('#key input[type=checkbox]').each(function () {
        $(this).attr('checked', false)
        keyobj[$(this).attr('name')] = 0
    })
    updatePage()
}

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

function calculateFeatureOrder2() {
    var keytracker = []
    for (var item in keyobj) {
        keytracker.push([item, 0])
    }
    for (var n in keytracker) {
        var item = keytracker[n][0]
        for (var row in data) {
            if (data[row][item] == 'True') {
                keytracker[n][1] += 1;
            }
        }
    }
    keytracker.sort(compareSecondCol)
    return keytracker.reverse()
}