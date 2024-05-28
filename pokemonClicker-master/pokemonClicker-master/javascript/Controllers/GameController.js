'use strict';

pkmn.controller(
    'GameController',
    function (
        $scope,
        $interval,
        $http,
        pokemonData,
        $attrs
       ) {
          $scope.pokemonList = pokemonData;
          $scope.caughtPokemon = [];
          $scope.currentPokemonImage = '000';
          $scope.currentPokemon = 0;
          $scope.catchText = "";
          $scope.player = {
            caughtType:{},
            caughtMaxType:{},
            caughtPokemon:{},
          };

          $scope.preloadImages = function(){
            var url = '';
            var html = "";
            var pokemonList = $scope.pokemonList;
            for (var i = 0; i < pokemonList.length; i++){
                var pokemonPosition = pokemonList[i].id;
                url = 'images/' + pokemonPosition + '.gif';
                $scope.preloadImage(url);
                html = 'Preloading all images: ' + i + '/' + (pokemonList.length - 1);
                if (i === pokemonList.length - 1) {
                    html = 'Done loading all images';
                };
            };
          };

          $scope.preloadImage = function(url) {
              var img = new Image();
              img.src = url;
          };
          $scope.preloadImages();

          $scope.getAllPokemonTypes = function(){
            var pokemonList = $scope.pokemonList;
            var player = $scope.player
            for (var i = 0; i < pokemonList.length; i++){
              var type = pokemonList[i].type;
          		var typeMax = pokemonList[i].type + "Max";
              var type2 = pokemonList[i].type2;
              var typeMax2 = pokemonList[i].type2 + "Max";
              if(player.caughtType[type] === undefined){
                player.caughtType[type] = 0;
              }
              if(player.caughtMaxType[typeMax] === undefined){
                player.caughtMaxType[typeMax] = 1;
              }
              else{
                player.caughtMaxType[typeMax] += 1;
              }
              if(type2 !== 'None'){
                if(player.caughtType[type2] === undefined){
                  player.caughtType[type2] = 0;
                }
                if(player.caughtMaxType[typeMax2] === undefined){
                  player.caughtMaxType[typeMax2] = 1;
                }
                else{
                  player.caughtMaxType[typeMax2] += 1;
                }
              }
          	};
          };
          $scope.getAllPokemonTypes();

          $scope.getRandomPokemon = function(){
            var randomPokemon = $scope.pokemonList[Math.floor(Math.random()*$scope.pokemonList.length)];
          	var index = $scope.pokemonList.indexOf(randomPokemon);
          	var pokemonPosition = randomPokemon.id
            $scope.currentPokemonImage = pokemonPosition;
            $scope.currentPokemon = index;
          }
          $scope.getRandomPokemon();

          $scope.catchPokemon = function(index){
          	var pokemon = $scope.pokemonList[index];
            var randomNumber = Math.floor(Math.random() * 255) + 1;//255 as in pokeball chance: normal 0-255, great: 0-200, ultra: 0-150, 0-2 means you always catch, since lowest catch rate is 3 on pokemons.
            var playerCaught = $scope.player.caughtPokemon;
            if(randomNumber < pokemon.chance){
            var caught = pokemon;
            caught['damage'] = pokemon.stats[6] / pokemon.chance;
              if(playerCaught[pokemon.name] === undefined){
                  caught['amount'] = 1
                  playerCaught[pokemon.name] = caught;
                  $scope.player.caughtType[pokemon.type] += 1;
              }
              else{
                  playerCaught[pokemon.name].amount += 1;
                  playerCaught[pokemon.name].damage *= playerCaught[pokemon.name].amount;
              }
            $scope.catchText = 'You have caught ' + pokemon.name;
            }
            else{
              $scope.catchText = 'You failed to catch ' + pokemon.name;
            }
            $scope.getRandomPokemon();
          }
       });
