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

    var data = {"OkPercent": 99.10560344827586, "KoPercent": 0.8943965517241379};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6236977370689655, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.972125, 500, 1500, "Merchants"], "isController": false}, {"data": [0.486625, 500, 1500, "Account Balance"], "isController": false}, {"data": [0.4716796875, 500, 1500, "Eligibility"], "isController": false}, {"data": [0.21161845339383625, 500, 1500, "NTC Prepaid Topup Confirm"], "isController": false}, {"data": [0.3390523643884554, 500, 1500, "Ncell Topup  Booking"], "isController": false}, {"data": [0.993140625, 500, 1500, "Service Banner"], "isController": false}, {"data": [0.491109375, 500, 1500, "Token"], "isController": false}, {"data": [0.992921875, 500, 1500, "Merchants category"], "isController": false}, {"data": [0.4885625, 500, 1500, "Registered Account"], "isController": false}, {"data": [0.4822890625, 500, 1500, "Graph Details"], "isController": false}, {"data": [0.990609375, 500, 1500, "Main Banner"], "isController": false}, {"data": [0.32884288145207036, 500, 1500, "NTC Prepaid Topup  Booking"], "isController": false}, {"data": [0.4804375, 500, 1500, "Card list"], "isController": false}, {"data": [0.3333796940194715, 500, 1500, "Esewa Booking"], "isController": false}, {"data": [0.99803125, 500, 1500, "JSR223 Sampler"], "isController": false}, {"data": [0.974125, 500, 1500, "Server Version"], "isController": false}, {"data": [0.993609375, 500, 1500, "Language List"], "isController": false}, {"data": [0.4882578125, 500, 1500, "Recent Statement"], "isController": false}, {"data": [0.21108020398701902, 500, 1500, "Esewa  Confirm"], "isController": false}, {"data": [0.975359375, 500, 1500, "Public menus"], "isController": false}, {"data": [0.470734375, 500, 1500, "FCM Subscription"], "isController": false}, {"data": [0.9929375, 500, 1500, "Intial Data"], "isController": false}, {"data": [0.43415625, 500, 1500, "Login"], "isController": false}, {"data": [0.2481902792140641, 500, 1500, "Ncell Topup Confirm"], "isController": false}, {"data": [0.5020625, 500, 1500, "Profile image"], "isController": false}, {"data": [0.467015625, 500, 1500, "Protected menus"], "isController": false}, {"data": [0.48240625, 500, 1500, "Recent Payments"], "isController": false}, {"data": [0.490421875, 500, 1500, "Accounts Balance"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 928000, 8300, 0.8943965517241379, 942.3727931035061, 0, 927198, 620.0, 1233.0, 1610.0, 2882.950000000008, 3.956251396891404, 31.849199318705267, 1.5810716283903679], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Merchants", 32000, 184, 0.575, 546.7309999999969, 0, 584018, 210.0, 425.0, 508.0, 852.9900000000016, 0.13645099523688806, 14.082718602899963, 0.051569048555097384], "isController": false}, {"data": ["Account Balance", 64000, 584, 0.9125, 1043.2272343750035, 0, 714740, 843.0, 1160.0, 1304.0, 1950.9800000000032, 0.27288146936301755, 0.327264003068761, 0.1092576456119291], "isController": false}, {"data": ["Eligibility", 64000, 668, 1.04375, 1319.6294999999932, 0, 788578, 987.0, 1322.0, 1534.0, 2273.9900000000016, 0.2728883086146413, 0.11164424253760058, 0.09941294933255912], "isController": false}, {"data": ["NTC Prepaid Topup Confirm", 10578, 135, 1.276233692569484, 2295.9679523539344, 0, 688983, 1594.0, 3027.2000000000007, 3700.0, 5379.629999999997, 0.04511175670080707, 0.07293506545084512, 0.03970644895020895], "isController": false}, {"data": ["Ncell Topup  Booking", 10637, 91, 0.855504371533327, 1573.6825232678439, 0, 498289, 1250.0, 2060.0, 2437.1000000000004, 3596.300000000012, 0.04536149637038944, 0.026355540265080867, 0.03648543743510602], "isController": false}, {"data": ["Service Banner", 32000, 196, 0.6125, 205.2007499999978, 0, 704732, 81.0, 159.0, 216.0, 351.0, 0.1364324679002649, 0.054789210637980604, 0.045813779567340666], "isController": false}, {"data": ["Token", 32000, 304, 0.95, 1174.1166874999942, 0, 865046, 845.0, 1167.0, 1343.0, 2106.9600000000064, 0.13645210190519286, 0.179740011306112, 0.04451671537928529], "isController": false}, {"data": ["Merchants category", 32000, 181, 0.565625, 392.35162500000223, 0, 584883, 138.0, 233.0, 294.9500000000007, 415.0, 0.13645263022636067, 0.9937243831640729, 0.0544955276728322], "isController": false}, {"data": ["Registered Account", 32000, 304, 0.95, 1050.6093124999938, 0, 679753, 846.0, 1163.0, 1345.0, 2104.970000000005, 0.13645187731175065, 0.11000866279667537, 0.04704498279410053], "isController": false}, {"data": ["Graph Details", 64000, 643, 1.0046875, 1118.2608593750094, 0, 711606, 897.0, 1188.0, 1322.0, 1966.9700000000048, 0.2728952168627719, 0.23657523117747986, 0.11192468609476151], "isController": false}, {"data": ["Main Banner", 32000, 195, 0.609375, 314.3015312500009, 0, 556732, 94.0, 210.0, 283.0, 484.0, 0.13643246324681046, 0.10285985151509296, 0.04541462311621356], "isController": false}, {"data": ["NTC Prepaid Topup  Booking", 10578, 96, 0.9075439591605219, 1560.5796937039086, 0, 593725, 1279.5, 2096.0, 2487.0499999999993, 3685.4199999999983, 0.04511167435928468, 0.026354320862901546, 0.03619705321213054], "isController": false}, {"data": ["Card list", 32000, 283, 0.884375, 1109.5553437500068, 0, 654320, 898.0, 1234.0, 1445.0, 2210.980000000003, 0.13644684509971258, 0.08298002725779437, 0.0487731013356479], "isController": false}, {"data": ["Esewa Booking", 10785, 128, 1.186833565136764, 1579.4527584608268, 0, 605078, 1254.0, 2065.0, 2423.699999999999, 3661.0, 0.04599344550116168, 0.033056098116454755, 0.036959125796632276], "isController": false}, {"data": ["JSR223 Sampler", 32000, 0, 0.0, 21.21350000000006, 0, 214277, 0.0, 1.0, 1.0, 119.0, 0.1364311556386969, 0.0, 0.0], "isController": false}, {"data": ["Server Version", 32000, 184, 0.575, 422.25615624999915, 0, 791677, 69.0, 278.0, 474.0, 734.0, 0.13643131792499633, 0.05865045709772889, 0.04621254494537912], "isController": false}, {"data": ["Language List", 32000, 185, 0.578125, 187.077999999998, 0, 552846, 87.0, 142.0, 194.0, 326.9900000000016, 0.13643258714514256, 0.138915782640793, 0.04501550910757867], "isController": false}, {"data": ["Recent Statement", 64000, 650, 1.015625, 1117.6422187500048, 0, 687744, 830.0, 1142.0, 1262.0, 1900.9800000000032, 0.2728837068007664, 0.2876059734881391, 0.10979082623503829], "isController": false}, {"data": ["Esewa  Confirm", 10785, 167, 1.5484469170143718, 2371.308298562821, 0, 719392, 1616.0, 3144.3999999999996, 3744.699999999999, 5533.979999999996, 0.04599344746258692, 0.07484160615388531, 0.04117603880897458], "isController": false}, {"data": ["Public menus", 32000, 193, 0.603125, 380.65709374999915, 0, 595837, 155.0, 356.0, 476.0, 1031.9900000000016, 0.13644500894966266, 1.7072657302315475, 0.05207199245235672], "isController": false}, {"data": ["FCM Subscription", 32000, 830, 2.59375, 1071.0045312500115, 0, 676461, 862.0, 1251.0, 1579.0, 6371.720000000525, 0.13644621791742742, 0.0824432258200278, 0.08470043884706716], "isController": false}, {"data": ["Intial Data", 32000, 176, 0.55, 275.47846875000005, 0, 551631, 79.0, 173.0, 237.0, 397.0, 0.13643188563924621, 0.7878079536525621, 0.04541443084650579], "isController": false}, {"data": ["Login", 32000, 199, 0.621875, 1198.8810624999956, 0, 421454, 1081.0, 1622.0, 1992.9500000000007, 2899.980000000003, 0.13644501593112818, 0.20579881663955923, 0.056463102863914795], "isController": false}, {"data": ["Ncell Topup Confirm", 10637, 134, 1.259753689950174, 2218.83660806618, 0, 593640, 1491.0, 2804.0, 3448.1000000000004, 5139.0, 0.045361851343170306, 0.07298209473998352, 0.03988558127338167], "isController": false}, {"data": ["Profile image", 32000, 327, 1.021875, 1123.6327499999986, 0, 924547, 813.0, 1125.0, 1273.0, 2004.9900000000016, 0.13645199775425598, 0.07670127614572186, 0.04558124684015018], "isController": false}, {"data": ["Protected menus", 32000, 311, 0.971875, 1259.9587812500063, 0, 648708, 975.0, 1366.0, 1686.0, 2639.950000000008, 0.13645004568091684, 11.58853808829531, 0.05250017112221549], "isController": false}, {"data": ["Recent Payments", 64000, 641, 1.0015625, 1229.0073437500107, 0, 923320, 903.0, 1245.0, 1463.9000000000015, 2373.950000000008, 0.27289859489886176, 0.16741973599136467, 0.10899663822403803], "isController": false}, {"data": ["Accounts Balance", 32000, 311, 0.971875, 1073.2330624999997, 0, 927198, 795.0, 1142.0, 1307.0, 2028.9700000000048, 0.13645470514841726, 0.16555327125167327, 0.045986576529030834], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 95, 1.144578313253012, 0.010237068965517241], "isController": false}, {"data": ["406/Not Acceptable", 20, 0.24096385542168675, 0.0021551724137931034], "isController": false}, {"data": ["502/Bad Gateway", 3950, 47.59036144578313, 0.42564655172413796], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 1190, 14.337349397590362, 0.12823275862068967], "isController": false}, {"data": ["500/Internal Server Error", 510, 6.144578313253012, 0.05495689655172414], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to bankxp-v-7-1-19-0.10.13.194.110.nip.io:443 [bankxp-v-7-1-19-0.10.13.194.110.nip.io/10.13.194.110] failed: Connection refused", 3, 0.03614457831325301, 3.232758620689655E-4], "isController": false}, {"data": ["401/Unauthorized", 2517, 30.325301204819276, 0.27122844827586207], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io: Name or service not known", 7, 0.08433734939759036, 7.543103448275862E-4], "isController": false}, {"data": ["Value in json path '$.success' expected to match regexp 'true', but it did not match: 'false'", 8, 0.0963855421686747, 8.620689655172414E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 928000, 8300, "502/Bad Gateway", 3950, "401/Unauthorized", 2517, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 1190, "500/Internal Server Error", 510, "400/Bad Request", 95], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Merchants", 32000, 184, "502/Bad Gateway", 140, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "", "", "", "", "", ""], "isController": false}, {"data": ["Account Balance", 64000, 584, "401/Unauthorized", 268, "502/Bad Gateway", 227, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 83, "500/Internal Server Error", 4, "406/Not Acceptable", 2], "isController": false}, {"data": ["Eligibility", 64000, 668, "502/Bad Gateway", 308, "401/Unauthorized", 275, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 83, "406/Not Acceptable", 2, "", ""], "isController": false}, {"data": ["NTC Prepaid Topup Confirm", 10578, 135, "401/Unauthorized", 49, "502/Bad Gateway", 47, "400/Bad Request", 27, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 10, "406/Not Acceptable", 1], "isController": false}, {"data": ["Ncell Topup  Booking", 10637, 91, "502/Bad Gateway", 47, "401/Unauthorized", 31, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 13, "", "", "", ""], "isController": false}, {"data": ["Service Banner", 32000, 196, "502/Bad Gateway", 152, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "", "", "", "", "", ""], "isController": false}, {"data": ["Token", 32000, 304, "502/Bad Gateway", 130, "401/Unauthorized", 129, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "406/Not Acceptable", 1, "", ""], "isController": false}, {"data": ["Merchants category", 32000, 181, "502/Bad Gateway", 136, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to bankxp-v-7-1-19-0.10.13.194.110.nip.io:443 [bankxp-v-7-1-19-0.10.13.194.110.nip.io/10.13.194.110] failed: Connection refused", 1, "", "", "", ""], "isController": false}, {"data": ["Registered Account", 32000, 304, "502/Bad Gateway", 130, "401/Unauthorized", 129, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "406/Not Acceptable", 1, "", ""], "isController": false}, {"data": ["Graph Details", 64000, 643, "401/Unauthorized", 284, "502/Bad Gateway", 270, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 83, "Value in json path '$.success' expected to match regexp 'true', but it did not match: 'false'", 4, "406/Not Acceptable", 2], "isController": false}, {"data": ["Main Banner", 32000, 195, "502/Bad Gateway", 151, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "", "", "", "", "", ""], "isController": false}, {"data": ["NTC Prepaid Topup  Booking", 10578, 96, "502/Bad Gateway", 42, "401/Unauthorized", 42, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 11, "406/Not Acceptable", 1, "", ""], "isController": false}, {"data": ["Card list", 32000, 283, "502/Bad Gateway", 120, "401/Unauthorized", 118, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "406/Not Acceptable", 1, "", ""], "isController": false}, {"data": ["Esewa Booking", 10785, 128, "401/Unauthorized", 54, "502/Bad Gateway", 53, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to bankxp-v-7-1-19-0.10.13.194.110.nip.io:443 [bankxp-v-7-1-19-0.10.13.194.110.nip.io/10.13.194.110] failed: Connection refused", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Server Version", 32000, 184, "502/Bad Gateway", 140, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 39, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io: Name or service not known", 5, "", "", "", ""], "isController": false}, {"data": ["Language List", 32000, 185, "502/Bad Gateway", 141, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "", "", "", "", "", ""], "isController": false}, {"data": ["Recent Statement", 64000, 650, "502/Bad Gateway", 296, "401/Unauthorized", 264, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 83, "Value in json path '$.success' expected to match regexp 'true', but it did not match: 'false'", 4, "406/Not Acceptable", 2], "isController": false}, {"data": ["Esewa  Confirm", 10785, 167, "502/Bad Gateway", 58, "401/Unauthorized", 57, "400/Bad Request", 36, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 16, "", ""], "isController": false}, {"data": ["Public menus", 32000, 193, "502/Bad Gateway", 149, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "", "", "", "", "", ""], "isController": false}, {"data": ["FCM Subscription", 32000, 830, "500/Internal Server Error", 502, "502/Bad Gateway", 167, "401/Unauthorized", 116, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "406/Not Acceptable", 1], "isController": false}, {"data": ["Intial Data", 32000, 176, "502/Bad Gateway", 132, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "", "", "", "", "", ""], "isController": false}, {"data": ["Login", 32000, 199, "502/Bad Gateway", 151, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "500/Internal Server Error", 3, "406/Not Acceptable", 1, "", ""], "isController": false}, {"data": ["Ncell Topup Confirm", 10637, 134, "502/Bad Gateway", 54, "401/Unauthorized", 36, "400/Bad Request", 32, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 11, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io: Name or service not known", 1], "isController": false}, {"data": ["Profile image", 32000, 327, "502/Bad Gateway", 154, "401/Unauthorized", 128, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "406/Not Acceptable", 1, "", ""], "isController": false}, {"data": ["Protected menus", 32000, 311, "502/Bad Gateway", 143, "401/Unauthorized", 123, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 44, "406/Not Acceptable", 1, "", ""], "isController": false}, {"data": ["Recent Payments", 64000, 641, "502/Bad Gateway", 284, "401/Unauthorized", 271, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 83, "406/Not Acceptable", 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to bankxp-v-7-1-19-0.10.13.194.110.nip.io:443 [bankxp-v-7-1-19-0.10.13.194.110.nip.io/10.13.194.110] failed: Connection refused", 1], "isController": false}, {"data": ["Accounts Balance", 32000, 311, "401/Unauthorized", 143, "502/Bad Gateway", 128, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: bankxp-v-7-1-19-0.10.13.194.110.nip.io", 39, "406/Not Acceptable", 1, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
