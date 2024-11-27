
const States = {
    FREEZING: "Freezing",
    COLD: "Cold",
    CHILLY: "Chilly",
    WARM: "Warm",
    HOT: "Hot",
    SCORCHING: "Scorching",
    UNKNOWN: "Unknown",
};

const notFoundMessage = "Not Found"
const somethingWentWrongMessage = "Sorry Something Went Wrong"

const temperature = document.querySelector(".temp")
const locationField = document.querySelector(".loc p")
const date = document.querySelector(".time p")
const weather = document.querySelector(".condition p")
const search = document.querySelector(".search_field")
const form = document.querySelector('form')

let locMap = new Map()

locMap.set("Quijorna", [40.4276,-4.0568])

const fetchData = async (lat, long) =>{
	const res = await fetch(getUrl(lat,long))
	const data = await res.json()

	console.log(data)
	updatePage(data.current.temperature_2m,search.value,data.current.time,getState(data.current.temperature_2m))
}

function getUrl(lat, long){
	return "https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+long+"&current=temperature_2m&forecast_days=1&models=jma_seamless";
}

function updatePage(temp, loc , time, weath){
	try{
		temperature.innerText = temp
		locationField.innerText = loc
		date.innerText = time
		weather.innerText = weath
	}catch{
		temperature.innerText = somethingWentWrongMessage
		locationField.innerText = ""
		date.innerText = ""
		weather.innerText = ""
	}
}

function getState(temperature)
{
	switch (true) {
		case temperature <= 0:
		  return States.FREEZING;
		case temperature <= 10:
		  return States.COLD;
		case temperature <= 15:
		  return States.CHILLY;
		case temperature <= 25:
		  return States.WARM;
		case temperature <= 35:
		  return States.HOT;
		case temperature >= 35:
		  return States.SCORCHING;
		default:
		  throw new Error("Invalid temperature value");
	  }
}

function searchData(e){
 	e.preventDefault()
	let coord = locMap.get(search.value)
	if(coord == undefined){
		updatePage(notFoundMessage,"","","")
		return
	}
	lat = coord[0]
	long = coord[1]
	console.log(lat)
 	fetchData(lat,long)
}

form.addEventListener('submit', searchData)