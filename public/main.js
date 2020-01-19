'use strict';

const form = document.getElementById('vote-form');
const optionA = document.getElementById('aA');
const optionB = document.getElementById('aB');
const optionC = document.getElementById('aC');
const optionD = document.getElementById('aD');
const radioA = document.getElementById('A');
const radioB = document.getElementById('B');
const radioC = document.getElementById('C');
const radioD = document.getElementById('D');
const btn = document.getElementById('btn');
const modal = document.getElementById('modal');

//Change bg color
const changeBg = event => {
    if (radioA.checked){
        optionA.classList.add('option-selected');
        optionB.classList.remove('option-selected');
        optionC.classList.remove('option-selected');
        optionD.classList.remove('option-selected');
    } else if (radioB.checked){
        optionB.classList.add('option-selected');
        optionA.classList.remove('option-selected');
        optionC.classList.remove('option-selected');
        optionD.classList.remove('option-selected');
    } else if (radioC.checked){
        optionC.classList.add('option-selected');
        optionA.classList.remove('option-selected');
        optionB.classList.remove('option-selected');
        optionD.classList.remove('option-selected');
    } else if (radioD.checked){
        optionD.classList.add('option-selected');
        optionA.classList.remove('option-selected');
        optionB.classList.remove('option-selected');
        optionC.classList.remove('option-selected');
    }
}

optionA.addEventListener('click', changeBg);
optionB.addEventListener('click', changeBg);
optionC.addEventListener('click', changeBg);
optionD.addEventListener('click', changeBg);

//Show Modal
const showModal = () => {
    modal.classList.add('show-modal');
}

btn.addEventListener('click', showModal);

//Form submit event
form.addEventListener('submit', (e) =>{
    const choice = document.querySelector('input[name=os]:checked').value;
    const data = {os: choice};

    //fetch('http://localhost:3000/poll', {
    fetch('http://35.181.63.216/poll', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));

    e.preventDefault();
});

//DB
//fetch('http://localhost:3000/poll')
fetch('http://35.181.63.216/poll')
    .then(response => response.json())
    .then(data => {
        const votes = data.votes;
        const totalVotes = votes.length;
        //Count vote points - acc/current value
        const voteCounts = votes.reduce(
            (acc, vote) => (
                (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc),
                {}
        );

        //Set initial data points
        if (Object.keys(voteCounts).length === 0 && voteCounts.constructor === Object) {
            voteCounts.A = 0;
            voteCounts.B = 0;
            voteCounts.C = 0;
            voteCounts.D = 0;
        }

        //Canvas chart
        let dataPoints = [
            {label: 'A', y: voteCounts.A},
            {label: 'B', y: voteCounts.B},
            {label: 'C', y: voteCounts.C},
            {label: 'D', y: voteCounts.D},
        ];

        const chartContainer = document.querySelector('#chart-container');

        if(chartContainer){

            CanvasJS.addColorSet("qsm",
                [//colorSet Array
                "#e39406"           
                ]
            );

            const chart = new CanvasJS.Chart('chart-container', {
                animationEnabled: true,
                theme: 'theme1',
                colorSet: 'qsm',
                backgroundColor: null,
                title: {
                    text: `Respuestas recibidas: ${totalVotes}`,
                    fontFamily: 'Montserrat, Arial, sans-serif',
                    fontColor: '#ffffff',
                    fontSize: 25
                },
                axisX:{
                    labelFontFamily: 'Montserrat, Arial, sans-serif',
                    labelFontSize: 20,
                    labelFontColor: '#ffffff',
                    labelFontWeight: "lighter"
                },
                axisY:{
                    labelFontFamily: 'Montserrat, Arial, sans-serif',
                    labelFontColor: '#ffffff',
                    labelFontWeight: "lighter",
                    lineThickness: 0,
                    gridColor: '#0a093b'
                },
                data: [
                    {
                        type: 'column',
                        dataPoints: dataPoints
                    }
                ]
            });
            chart.options.title.text = `Respuestas recibidas:  ${totalVotes}`
            chart.render();

            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            var pusher = new Pusher('dbfb16c99181aee9816e', {
            cluster: 'eu',
            forceTLS: true
            });
        
            var channel = pusher.subscribe('os-poll');    ////////////CHANGE ACCORDING TO POLL.JS
            channel.bind('os-vote', function(data) {        ////////////CHANGE ACCORDING TO POLL.JS
            dataPoints = dataPoints.map(x => {
                if(x.label == data.os){
                    x.y += data.points; //each point = 1;
                    return x;
                } else {
                    return x;
                }
            });
            chart.render();

            });
        }
    })

