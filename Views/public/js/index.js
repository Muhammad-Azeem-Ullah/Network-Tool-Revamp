var arrLabels = [];
var arrDatasets = [];
var myChart;
var userArray = [];
var userDownloadsObject = {};

setTimeout(function () {

    //Configure Socket

    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) {
        console.log('Sorry, but your browser doesn\'t support WebSocket.');
        return;
    }
    // open connection
    var connection = new WebSocket('ws://127.0.0.1:1337');
    connection.onopen = function () {
        console.log('Connected.');
    };
    connection.onerror = function (error) {
        console.log('Sorry, but there\'s some problem with your ' +
            'connection or the server is down.');
    };
    //Retry after connection lost
    setInterval(function () {
        if (connection.readyState !== 1) {
            console.log('Unable to communicate with the WebSocket server.');
        }
    }, 3000);

    fillarrLabels();

    initGraphObject();

    let isFirstRequest = true;

    connection.onmessage = function (message) {
        function parseMessage(message) {
            try {
                userArray = JSON.parse(message.data);

                if (Object.keys(userDownloadsObject).length > 0) {
                    isFirstRequest = false;
                    for (let i = 0; i < userArray.length; i++) {
                        if (userDownloadsObject[userArray[i].ipAddress]) {
                            let temp = userArray[i].totalDownload;
                            userArray[i].totalDownload =
                                (((userArray[i].totalDownload - userDownloadsObject[userArray[i].ipAddress].totalDownload) / ((+new Date() - userDownloadsObject[userArray[i].ipAddress].timeStamp) / 1000))).toFixed(5);
                            userArray[i].totalDownload = userArray[i].totalDownload * 8 / (1024 * 1024);

                            userArray[i].totalUpload =
                                ((userArray[i].totalUpload - userDownloadsObject[userArray[i].ipAddress].totalUpload) / ((+new Date() - userDownloadsObject[userArray[i].ipAddress].timeStamp) / 1000)).toFixed(5);
                            userArray[i].totalUpload = userArray[i].totalUpload * 8 / (1024 * 1024);

                            if (userArray[i].totalDownload > 100) {
                                console.log("check")
                                console.log(temp + " - " + userDownloadsObject[userArray[i].ipAddress].totalDownload);
                                console.log(userArray[i].totalDownload)
                            }

                        }
                    }
                }

                let tempArray = JSON.parse(message.data);

                for (let i = 0; i < tempArray.length; i++) {
                    userDownloadsObject[tempArray[i].ipAddress] = {
                        totalDownload: tempArray[i].totalDownload,
                        totalUpload: tempArray[i].totalUpload,
                        timeStamp: +new Date()
                    };
                }

                tempArray.length = 0;

            } catch (e) {
                console.log(e.message);
            }
        }

        parseMessage(message);

        function compare(a, b) {
            if (a.ipAddress < b.ipAddress)
                return -1;
            if (a.ipAddress > b.ipAddress)
                return 1;
            return 0;
        }
        userArray.sort(compare);

        if (userArray.length > 0) {
            userArray.forEach(user => {
                let flag = true;
                for (let i = 0; i < arrDatasets.length; i++) {
                    if (arrDatasets[i].label.split(' ')[0] == user.ipAddress) {
                        flag = false;
                        break;
                    }
                }

                if (flag) {
                    let w = function () {
                        return (Math.floor(Math.random() * 254) + 1).toString();
                    };
                    let a = w();
                    let b = w();
                    let c = w();
                    let colorBorder = "rgba(" + a + ", " + b + ", " + c + ", 0.8)";
                    let colorBackground = "rgba(" + a + ", " + b + ", " + c + ", 0.2)";
                    arrDatasets.push({
                        data: [],
                        label: user.ipAddress,
                        borderColor: colorBorder,
                        backgroundColor: colorBackground,
                        fill: 'start'
                    });
                }
            });
            topUser = {
                ipAddress: "",
                totalDownload: 0
            };
            secondTopUser = {
                ipAddress: "",
                totalDownload: 0
            };
            thirdTopUser = {
                ipAddress: "",
                totalDownload: 0
            };

            $.each(arrDatasets, function (index, dataset) {


                if (!isFirstRequest && userArray[index].totalDownload >= 1) {
                    dataset.data.push(userArray[index].totalDownload);
                    dataset.label = userArray[index].ipAddress.padEnd(16) + "\t" +
                        "Upload: " + userArray[
                            index].totalUpload + " Download";

                    if (userArray[index].totalDownload > topUser.totalDownload) {
                        thirdTopUser = $.extend({}, secondTopUser);
                        secondTopUser = $.extend({}, topUser);
                        topUser.totalDownload = userArray[index].totalDownload;
                        topUser.ipAddress = userArray[index].ipAddress;
                    } else if (userArray[index].totalDownload > secondTopUser.totalDownload) {
                        thirdTopUser = $.extend({}, secondTopUser);
                        secondTopUser.totalDownload = userArray[index].totalDownload;
                        secondTopUser.ipAddress = userArray[index].ipAddress;
                    } else if (userArray[index].totalDownload > thirdTopUser.totalDownload) {
                        thirdTopUser.totalDownload = userArray[index].totalDownload;
                        thirdTopUser.ipAddress = userArray[index].ipAddress;
                    }
                } else {
                    dataset.data.push(0);
                    dataset.label = userArray[index].ipAddress.padEnd(16) + "\t" +
                        "Upload: " + 0 + " Download";
                }

                if (dataset.data.length > 31) {
                    dataset.data.shift();
                }
            });


            $('#topUserIp').html(topUser.ipAddress);
            $('#topUserSpeed').html(topUser.totalDownload);
            $('#secondTopUserIp').html(secondTopUser.ipAddress);
            $('#secondTopUserSpeed').html(secondTopUser.totalDownload);
            $('#thirdTopUserIp').html(thirdTopUser.ipAddress);
            $('#thirdTopUserSpeed').html(thirdTopUser.totalDownload);

            userArray.length = 0;

            myChart.update();
        }

    }

}, 1000);

function fillarrLabels() {
    for (let i = 0; i <= 30; i++) {
        arrLabels.push(i + " sec");
    }
}

function initGraphObject() {
    myChart = new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
            labels: arrLabels,
            datasets: arrDatasets
        },
        options: {
            title: {
                display: true,
                text: 'Speed in Mbs over time'
            },
            devicePixelRatio: 1,
            legend: {
                display: false
            },
            tooltips: {
                mode: 'x',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            animation: {
                duration: 0 // general animation time
            }
        }
    });
}