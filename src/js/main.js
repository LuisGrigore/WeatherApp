//import '../css/styles.css';

const States = {
  FREEZING: "Freezing",
  COLD: "Cold",
  CHILLY: "Chilly",
  WARM: "Warm",
  HOT: "Hot",
  SCORCHING: "Scorching",
  UNKNOWN: "Unknown",
};

const notFoundMessage = "Not Found";
const somethingWentWrongMessage = "Sorry Something Went Wrong";

const temperature = document.querySelector(".temp p");
const locationField = document.querySelector(".loc p");
const dateField = document.querySelector(".time p");
const weatherField = document.querySelector(".condition p");
const search = document.querySelector(".search_field");
const form = document.querySelector("form");

search.value = "Madrid"

let locMap = new Map();
locMap.set("Quijorna", [40.4276, -4.0568]);


const fetchData = async (lat, long) => {
  try {
    const res = await fetch(getUrl(lat, long));
    const data = await res.json();

    const temp = data.current.temperature_2m;
    const time = formatDate(data.current.time);
    const state = getState(temp);

    updatePage(temp, search.value, time, state);
  } catch (err) {
    console.error(err);
    updatePage(somethingWentWrongMessage, "", "", States.UNKNOWN);
  }
};

function getUrl(lat, long) {
  return (
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    lat +
    "&longitude=" +
    long +
    "&current=temperature_2m&forecast_days=1&models=jma_seamless"
  );
}

function formatDate(iso) {
  if (!iso) return "";

  const dateObj = new Date(iso);
  const day = dateObj.getDate();

  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const month = monthNames[dateObj.getMonth()];

  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${day} ${month}, ${hours}:${minutes}`;
}

function updateBackground(state) {
  document.body.className = "";
  if (!state) return;
  document.body.classList.add(state.toLowerCase());
}

function animateUpdate() {
  const box = document.querySelector(".weather_container");
  box.classList.add("fade");
  setTimeout(() => box.classList.remove("fade"), 500);
}
function getWeatherIcon(state) {
  switch (state) {
    case States.FREEZING: return "❄️";
    case States.COLD: return "🥶";
    case States.CHILLY: return "🌬️";
    case States.WARM: return "🌤️";
    case States.HOT: return "☀️";
    case States.SCORCHING: return "🔥";
    default: return "❓";
  }
}

function updatePage(temp, loc, time, state) {
  try {
    temperature.innerText = temp + "º";
    locationField.innerText = loc;
    dateField.innerText = time;
    weatherField.innerText = `${state} ${getWeatherIcon(state)}`;
  } catch (err) {
    console.error(err);
    temperature.innerText = somethingWentWrongMessage;
    locationField.innerText = "";
    dateField.innerText = "";
    weatherField.innerText = "";
  }

  updateBackground(state);
  animateUpdate();
}

function getState(temperature) {
  if (temperature <= 0) return States.FREEZING;
  if (temperature <= 10) return States.COLD;
  if (temperature <= 15) return States.CHILLY;
  if (temperature <= 25) return States.WARM;
  if (temperature < 35) return States.HOT;
  return States.SCORCHING;
}

async function searchData(e) {
  e.preventDefault();
  const city = search.value.trim();

  if (!city) {
    updatePage("Not Found", "", "", "");
    return;
  }

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      updatePage("Not Found", "", "", "");
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];
    fetchData(latitude, longitude);
    locationField.innerText = name;

  } catch (err) {
    console.error(err);
    updatePage("Error", "", "", "");
  }
}


form.addEventListener("submit", searchData);

searchData()
