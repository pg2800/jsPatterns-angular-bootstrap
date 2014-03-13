// Observer
// MVP
// this means that I have to make the presenter do all the work
// also create a dumb model and a dumb view
// Module
angular.module("SearchFilterModule", [/*dependencies*/])
.factory("SearchFilterService", [function(){
	return {
		run: function(){
			// ------ MODEL -- "private"
			var Model = {
				citiesInMexico: ["Mexico City", "Ecatepec", "Guadalajara", "Puebla", "León", "Juárez", "Tijuana", "Zapopan", "Monterrey", "Nezahualcóyotl", "Chihuahua", "Naucalpan", "Mérida", "San Luis Potosí", "Aguascalientes", "Hermosillo", "Saltillo", "Mexicali", "Culiacán", "Guadalupe", "Acapulco", "Tlalnepantla", "Cancún", "Querétaro", "Chimalhuacán", "Torreón", "Morelia", "Reynosa", "Tlaquepaque", "Tuxtla Gutiérrez", "Durango", "Toluca", "Ciudad López Mateos", "Cuautitlán Izcalli", "Ciudad Apodaca", "Matamoro", "San Nicolás de los Garza", "Veracruz", "Xalapa", "Tonalá", "Mazatlán", "Irapuato", "Nuevo Laredo", "Xico", "Villahermosa", "General Escobedo", "Celaya", "Cuernavaca", "Tepic", "Ixtapaluca", "Ciudad Victoria", "Ciudad Obregón", "Tampico", "Ciudad Nicolás Romero", "Ensenada", "Coacalco de Berriozábal", "Santa Catarina", "Uruapan", "Gómez Palacio", "Los Mochis", "Pachuca", "Oaxaca", "Soledad de Graciano Sánchez", "Tehuacán", "Ojo de Agua", "Coatzacoalcos", "Campeche", "Monclova", "La Paz", "Nogales", "Buenavista", "Puerto Vallarta", "Tapachula", "Ciudad Madero", "San Pablo de las Salinas", "Chilpancingo", "Poza Rica", "Chicoloapan de Juárez", "Ciudad del Carmen", "Chalco de Díaz Covarrubias", "Jiutepec", "Salamanca", "San Luis Río Colorado", "San Cristóbal de las Casas", "Cuautla", "Ciudad Benito Juárez", "Chetumal", "Piedras Negras", "Playa del Carmen", "Zamora", "Córdoba", "San Juan del Río", "Colima", "Ciudad Acuña", "Manzanillo", "Zacatecas", "Veracru", "Ciudad Valles", "Guadalupe", "San Pedro Garza García", "Naucalpa", "Fresnillo", "Orizaba", "Miramar", "Iguala", "Delicias", "Ciudad de Villa de Álvarez", "Ciudad Cuauhtémoc", "Navojoa", "Guaymas", "Minatitlán", "Cuautitlán", "Texcoco", "Hidalgo del Parral", "Tepexpan", "Tulancingo", "San Juan Bautista Tuxtepec"]
			};

			// ------ PRESENTER
			// Prepopulate select element
			var cities = document.getElementById("cities");
			Model.citiesInMexico.forEach(function (city){
				var div = document.createElement("div"),
				text = document.createTextNode(city);
				div.setAttribute("data-value", city);
				div.appendChild(text);
				cities.appendChild(div);
			});
			// Observer Pattern and Facade Pattern
			var filter = document.getElementById("filter");
			addEvent(filter, "keyup", function (){
				var value = filter.value.toLowerCase(),
				divs = cities.childNodes,
				childrenLength = divs.length, 
				index, text, child;

				for(index = 1; index < childrenLength; index++){
					child = divs[index];
					text = (child.getAttribute("data-value")).toLowerCase();
					if(text.indexOf(value) == -1) child.setAttribute("class","hidden");
					else child.setAttribute("class","");
				}

			});

			publish("searchFilter");
		}
	}
}]);