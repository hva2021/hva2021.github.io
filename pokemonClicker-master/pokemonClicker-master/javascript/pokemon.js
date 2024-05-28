function createPreloadedImages(){
    var url = '';
    var html = "";
    for (var i = 0; i < pokemonList.length; i++){
        var pokemonPosition = pokemonList[i].id;
        url = 'images/' + pokemonPosition + '.gif';
        preloadImage(url);
        html = 'Preloading all images: ' + i + '/' + (pokemonList.length - 1);

        document.getElementById("pokemonCatchInfo").innerHTML = html;
        if (i === pokemonList.length - 1) {
            html = 'Done loading all images';
        };
    };
    document.getElementById("pokemonCatchInfo").innerHTML = html;
};
createPreloadedImages();

function preloadImage(url) {
    var img = new Image();
    img.src = url;
};

var caughtPokemon = [];
var player = {
	caught:{},
	maxType:{}
};
function getAllPokemonTypes(){
	for (var i = 0; i < pokemonList.length; i++){
    var type = firstToLowerCase(pokemonList[i].type);
    var type2 = firstToLowerCase(pokemonList[i].type2);
		var typeMax = firstToLowerCase(pokemonList[i].type + "Max");
    var typeMax2 = firstToLowerCase(pokemonList[i].type2 + "Max");
    if(!player.caught.hasOwnProperty(type)){
      player.caught[type] = 0;
    }
    else if(!player.caught.hasOwnProperty(type2)){
      player.caught[type2] = 0;
    }
    if(player.maxType.hasOwnProperty(typeMax2)){
      if(typeMax2 !== "noneMax"){
    		player.maxType[typeMax2] += 1;
      }
    }
    else{
      player.maxType[typeMax2] = 0;
    }
    if(player.maxType.hasOwnProperty(typeMax)){
          player.maxType[typeMax] += 1;
    }
    else{
      player.maxType[typeMax] = 0;
    }

	};
};
getAllPokemonTypes();
function getPokemon(){
	var html ="";
	if (pokemonList.length > 0){
	var randomPokemon = pokemonList[Math.floor(Math.random()*pokemonList.length)];
	var index = pokemonList.indexOf(randomPokemon);
	var pokemonPosition = randomPokemon.id
	html += '<div class="row">';
	html += '<div class="col-xs-4 col-xs-offset-4" style="height:200px;">';
	html += '<img class="img-responsive center-block" src="images/' + pokemonPosition + '.gif" style="margin-top:50px;">';
	html += '</div>';
	html += '</div>';
	html += '<div class="row">';
	html += '<div class="col-xs-4 col-xs-offset-4">';
	html += randomPokemon.id + " - " + randomPokemon.name + " - " + randomPokemon.type + ", " + randomPokemon.type2 + " (Catch rate: "  + randomPokemon.chance + ")";
	html += '<div class="row"><div class="col-xs-12">'
	html += '<button type="button" onclick="catchPokemon(' + index + ')">Catch it!</button>';
	html += '</div>';
	html += '<div class="col-xs-12">';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	}
	else{
	html += '<div class="col-xs-4 col-xs-offset-4">';
	html += "GAME FINISHED!";
	html += '</div>';
	}
	document.getElementById("pokemonDisplay").innerHTML = html;
};

function catchPokemon(index){
	var randomPokemon = pokemonList[index];
	var type = firstToLowerCase(randomPokemon.type);
  var type2 = firstToLowerCase(randomPokemon.type2);
	var randomNumber = Math.floor(Math.random() * 255) + 1;//255 as in pokeball chance: normal 0-255, great: 0-200, ultra: 0-150, 0-2 means you always catch, since lowest catch rate is 3 on pokemons.
	var html = "";
	if (randomNumber <= randomPokemon.chance){
		player.caught[type] += 1;
    if(type2 !== "none"){
  		player.caught[type2] += 1;
    }
		createPokemonInfo();
		html += "You caught " + randomPokemon.name;
		document.getElementById("pokemonCatchInfo").innerHTML = html;
		pokemonList.splice(index,1);//Remove Caught pokemon
	}
	else{
		html += "You fail to catch " + randomPokemon.name;
		document.getElementById("pokemonCatchInfo").innerHTML = html;
	};
getPokemon();
};
getPokemon();

function createPokemonInfo(){
	var html ="";
	for (var key in player.caught){
		var type = player.caught[key];
		var typeMax = key + "Max";
		var maxType = player.maxType[typeMax]
		html += key + " " + type + "/" + maxType + " | ";
	};

	document.getElementById("pokemonInfo").innerHTML = html;
};
createPokemonInfo();
