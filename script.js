window.onload = function() {
    
    var runBtn = document.getElementById('run'),
        generationsCountField = document.getElementById('generationsCount'),
        mutationRateField = document.getElementById('mutationRate'),
        populationSizeField = document.getElementById('populationSize'),
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        cities = [],
        citiesSeq = 0;
    
    canvas.addEventListener('click', function(evt) {
        var rect = canvas.getBoundingClientRect();
        citiesSeq++;
        cities.push({
            id: citiesSeq,
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        });
        ctx.beginPath();
        ctx.arc(cities[cities.length-1].x,cities[cities.length-1].y,10,0,2*Math.PI,false);
        ctx.stroke();
    });
    
    runBtn.addEventListener('click', function(evt) {
        evt.preventDefault();
    });
};