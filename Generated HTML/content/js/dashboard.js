/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.15333960489181, "KoPercent": 0.8466603951081844};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6774079320113314, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4470588235294118, 500, 1500, "POST/ConfirmOrder"], "isController": false}, {"data": [0.8369565217391305, 500, 1500, "Get/ signon "], "isController": false}, {"data": [0.8313953488372093, 500, 1500, "POST/Submit_NewOrder"], "isController": false}, {"data": [0.5, 500, 1500, "TC_03_Select_Fish_From_Category"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "POST /account/signon"], "isController": false}, {"data": [0.5, 500, 1500, "Get/ Add Item To Cart "], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "Get / Open Website"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.32558139534883723, 500, 1500, "TC_05_Submit_NewOrder_ AND_ Confirm"], "isController": true}, {"data": [0.8186813186813187, 500, 1500, "Get / Categories/Fish"], "isController": false}, {"data": [0.8546511627906976, 500, 1500, "Get /order/newOrderForm"], "isController": false}, {"data": [0.4945652173913043, 500, 1500, "SignIn With Account"], "isController": true}, {"data": [0.8505747126436781, 500, 1500, "Get / View Cart"], "isController": false}, {"data": [0.85, 500, 1500, "Get / Fish Product by ID"], "isController": false}, {"data": [0.06741573033707865, 500, 1500, "TC_04_AddToCart_To_Checkout"], "isController": true}, {"data": [0.7951807228915663, 500, 1500, "TC_06_View Order"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1063, 9, 0.8466603951081844, 527.762935089369, 0, 2057, 446.0, 902.0, 1075.0, 1415.0799999999997, 17.492759347024748, 356.9740910100711, 9.900294460077673], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST/ConfirmOrder", 85, 8, 9.411764705882353, 901.0470588235294, 371, 1508, 875.0, 1234.8, 1321.8000000000002, 1508.0, 1.517748732233412, 37.0415436285801, 0.9931105646471681], "isController": false}, {"data": ["Get/ signon ", 92, 0, 0.0, 499.75000000000017, 311, 1933, 429.5, 698.0, 936.7999999999987, 1933.0, 1.5499696745063682, 35.33104277579351, 0.8398082123121504], "isController": false}, {"data": ["POST/Submit_NewOrder", 86, 0, 0.0, 487.1162790697674, 334, 1020, 453.5, 728.5, 857.9499999999999, 1020.0, 1.5469016997931468, 38.50630115118266, 1.489216094073208], "isController": false}, {"data": ["TC_03_Select_Fish_From_Category", 91, 1, 1.098901098901099, 953.6923076923078, 301, 2103, 909.0, 1225.4, 1364.1999999999996, 2103.0, 1.5497803058687285, 69.87163486920535, 1.5768395924162948], "isController": true}, {"data": ["POST /account/signon", 91, 0, 0.0, 412.8021978021976, 284, 902, 376.0, 575.9999999999999, 718.1999999999999, 902.0, 1.5493845027497317, 0.8460726135647763, 1.0967102980862549], "isController": false}, {"data": ["Get/ Add Item To Cart ", 89, 0, 0.0, 935.0898876404491, 639, 1495, 876.0, 1255.0, 1353.0, 1495.0, 1.5297615978273946, 36.96745375801406, 0.8497649764090135], "isController": false}, {"data": ["Get / Open Website", 92, 1, 1.0869565217391304, 571.7065217391303, 317, 2057, 481.5, 936.3000000000001, 1065.25, 2057.0, 1.5383586382181793, 36.00609647766036, 0.7302500668851581], "isController": false}, {"data": ["Debug Sampler", 82, 0, 0.0, 0.048780487804878044, 0, 1, 0.0, 0.0, 0.8499999999999943, 1.0, 1.56113163004988, 0.6005396434622853, 0.0], "isController": false}, {"data": ["TC_05_Submit_NewOrder_ AND_ Confirm", 86, 10, 11.627906976744185, 1377.697674418605, 440, 2029, 1364.0, 1772.1999999999998, 1911.0, 2029.0, 1.5259319718234887, 74.79253396751184, 2.455883404824429], "isController": true}, {"data": ["Get / Categories/Fish", 91, 0, 0.0, 477.81318681318686, 300, 841, 435.0, 731.9999999999999, 820.0, 841.0, 1.5497803058687285, 34.86463504589734, 0.7912720811761299], "isController": false}, {"data": ["Get /order/newOrderForm", 86, 0, 0.0, 492.76744186046534, 316, 1320, 440.0, 737.6, 797.0499999999995, 1320.0, 1.539728578078562, 40.28440079269166, 0.8808539898664375], "isController": false}, {"data": ["SignIn With Account", 92, 1, 1.0869565217391304, 908.0652173913045, 482, 2318, 856.0, 1211.9, 1425.9499999999998, 2318.0, 1.549943561837694, 36.167625685470966, 1.924975018742524], "isController": true}, {"data": ["Get / View Cart", 87, 0, 0.0, 493.3218390804598, 310, 1414, 419.0, 779.4000000000001, 892.8, 1414.0, 1.5358813664048019, 37.11615033873245, 0.8771736252096389], "isController": false}, {"data": ["Get / Fish Product by ID", 90, 0, 0.0, 481.1555555555555, 319, 1363, 429.5, 677.0000000000002, 835.3000000000001, 1363.0, 1.550120564932828, 35.403737782035826, 0.7944704292972786], "isController": false}, {"data": ["TC_04_AddToCart_To_Checkout", 89, 34, 38.20224719101124, 1893.4943820224719, 803, 3153, 1812.0, 2400.0, 2720.5, 3153.0, 1.5297615978273946, 111.77948658450643, 2.5494627840371953], "isController": true}, {"data": ["TC_06_View Order", 83, 0, 0.0, 523.0000000000002, 324, 1236, 465.0, 820.0, 901.1999999999999, 1236.0, 1.5205642575799212, 40.74361517587249, 1.0234181780708986], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 8, 88.88888888888889, 0.7525870178739417], "isController": false}, {"data": ["The operation lasted too long: It took 2,057 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 11.11111111111111, 0.09407337723424271], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1063, 9, "500/Internal Server Error", 8, "The operation lasted too long: It took 2,057 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST/ConfirmOrder", 85, 8, "500/Internal Server Error", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get / Open Website", 92, 1, "The operation lasted too long: It took 2,057 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
