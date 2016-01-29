var app = require('express')();
var http = require('http').Server(app);
var express = require('express');
var io = require('socket.io')(http);

var cities = [],
    initPopulationSize,
    tournamentSize = 5,
    elitismOffset = 0,
    mutationRate,
    pop,
    limit = 0;
    

app.use(express.static('./'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  socket.on('start', function(settings) {
      cities = settings.cities;
      initPopulationSize = settings.popCount;
      elitismOffset = settings.elitism;
      mutationRate = settings.mutationRate;
      limit = settings.limit;
      
      console.log('started');
      
      var i = 0,
          prevFitnessValue = 0,
          generationsCount = 0;
      
      
      generateFirstPopulation();
      
      while (i<limit) {
          pop = evolve(pop);
          if ( prevFitnessValue != getFitness(findFittestFrom(pop)) ) {
              i = 0;
              prevFitnessValue = getFitness(findFittestFrom(pop));
          } else {
              i++;
          }
          generationsCount++;
          if (generationsCount % 10 == 0) {
              io.emit('draw path', {route: findFittestFrom(pop)});
          }
      }
      
  });
      
  socket.on('resume', function(settings) {
      limit = settings.limit;
      
      var i = 0,
          prevFitnessValue = 0,
          generationsCount = 0;
      
      while (i<limit) {
          pop = evolve(pop);
          if ( prevFitnessValue != getFitness(findFittestFrom(pop)) ) {
              i = 0;
              prevFitnessValue = getFitness(findFittestFrom(pop));
          } else {
              i++;
          }
          generationsCount++;
          if (generationsCount % 10 == 0) {
              io.emit('draw path', {route: findFittestFrom(pop)});
          }
      }
      
  }); 
});

function generateFirstPopulation() {
        var initPopCount = initPopulationSize,
            tempCities,
            tempRoute,
            randIndex;
        
        pop = new Population();
        
        for (var i=0;i<initPopCount;i++) {
            tempCities = Object.assign([],cities);
            tempRoute = [];
            while (tempCities.length) {
                randIndex = Math.floor(Math.random()*tempCities.length);
                tempRoute.push(tempCities[randIndex]);
                tempCities.splice(randIndex,1);
            };
            pop.add(tempRoute);
        };
    };

var Population = function() {
        this.species = [];
    };
    
    Population.prototype.add = function(spec) {
        this.species.push(Object.assign([],spec));
    };
    
    Population.prototype.size = function() {
        return this.species.length;
    };
    
    Population.prototype.get = function(index) {
        return this.species[index];
    };
    
    Population.prototype.all = function() {
        return this.species;
    };


function evolve(population) {
        var result = new Population(),
            dad,
            mom,
            newRoute,
            mutateRoll;
        
        if (elitismOffset) {
            result.add(findFittestFrom(population));
        };
        
        for (var i=elitismOffset;i<population.size();i++) {
            dad = tournamentSelection(population);
            mom = tournamentSelection(population);
            
            newRoute = crossOver(dad,mom);
            
            mutateRoll = Math.random();
            if (mutateRoll < mutationRate) {
                mutate(newRoute);
            };
            
            result.add(newRoute);
        };
        
        return result;
    };


function tournamentSelection(population) {
        var tournament = new Population(),
            randIndex,
            usedIndicies = [];
        
        for (var i=0;i<tournamentSize;i++) {
            randIndex = Math.floor(Math.random()*population.size());
            while (usedIndicies.indexOf(randIndex) != -1) {
                randIndex = Math.floor(Math.random()*population.size());
            };
            tournament.add(population.get(randIndex));
            usedIndicies.push(randIndex);
        };
        
        return findFittestFrom(tournament);
    };
    
    function findFittestFrom(population) {
        var currBest = getFitness(population.get(0)),
            bestIndex = 0;
        
        for (var i=0;i<population.size();i++) {
            if (getFitness(population.get(i)) > currBest) {
                currBest = getFitness(population.get(i));
                bestIndex = i;
            };
        };
        
        return population.get(bestIndex);
    };


  function getFitness(route) {
        return 1/getDistanceOf(route);
    };
    
    function getDistanceOf(route) {
        var result = 0;
        
        for (var i=0;i<route.length-1;i++) {
            result += Math.sqrt(Math.pow(route[i+1].x-route[i].x,2)+Math.pow(route[i+1].y-route[i].y,2));
            if (i == route.length-2) {
                result += Math.sqrt(Math.pow(route[0].x-route[i+1].x,2)+Math.pow(route[0].y-route[i+1].y,2));
            };
        };
        
        return result;
    };
    
    function crossOver(dad,mom) {
        var startPos = Math.floor(Math.random()*dad.length),
            endPos = Math.floor(Math.random()*dad.length),
            tempPos,
            child = [];
        
        for (var i=0;i<dad.length;i++) {
            child.push(0);
        }
        
        while (startPos == endPos) {
            endPos = Math.floor(Math.random()*dad.length);
        };
        
        if (startPos > endPos) {
            tempPos = endPos;
            endPos = startPos;
            startPos = tempPos;
        };
        
        for (var i=startPos;i<endPos;i++) {
            child[i] = dad[i];
        };
        
        for (var i=0;i<mom.length;i++) {
            var j;
            if (child.indexOf(mom[i]) == -1) {
                j = 0;
                while (child[j] != 0) {
                    j++;
                };
                child[j] = mom[i];
            };
        };
        
        return child;
    };
    
    function mutate(route) {
        var first = Math.floor(Math.random()*route.length),
            second = Math.floor(Math.random()*route.length),
            tempCity;
        
        while (first == second) {
            second = Math.floor(Math.random()*route.length);
        };
        
        tempCity = route[second];
        route[second] = route[first];
        route[first] = tempCity;
    };