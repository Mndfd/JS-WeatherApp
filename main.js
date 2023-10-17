
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess({ coords }) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then(renderWeather)
    .catch(e => {
      console.error(e)
      alert("Error getting weather.")
    })
}

function positionError() {
  alert(
    "There was an error getting your location. Please allow us to use your location and refresh the page."
  )
}

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current)
  renderDailyWeather(daily)
  renderHourlyWeather(hourly)

  document.body.classList.remove("blurred")
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.iconCode)
  setValue("current-temp", current.currentTemp)
  setValue("current-high", current.highTemp)
  setValue("current-low", current.lowTemp)
  setValue("current-fl-high", current.highFeelsLike)
  setValue("current-fl-low", current.lowFeelsLike)
  setValue("current-wind", current.windSpeed)
  setValue("current-precip", current.precip)
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" })
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
  dailySection.innerHTML = ""
  daily.forEach(day => {
    const element = dayCardTemplate.content.cloneNode(true)
    setValue("temp", day.maxTemp, { parent: element })
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element })
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
    dailySection.append(element)
  })
}


const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" })
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
const currentDay = new Date().toLocaleDateString('en-us', { weekday: "long" });
function renderHourlyWeather(hourly) {

  hourlySection.innerHTML = ""

  let i = 0;

  while (DAY_FORMATTER.format(hourly[i].timestamp) === currentDay) {
    const element = hourRowTemplate.content.cloneNode(true)
    setValue("temp", hourly[i].temp, { parent: element })
    setValue("fl-temp", hourly[i].feelsLike, { parent: element })
    setValue("wind", hourly[i].windSpeed, { parent: element })
    setValue("precip", hourly[i].precip, { parent: element })
    setValue("day", DAY_FORMATTER.format(hourly[i].timestamp), { parent: element })
    setValue("time", HOUR_FORMATTER.format(hourly[i].timestamp), { parent: element })
    element.querySelector("[data-icon]").src = getIconUrl(hourly[i].iconCode)
    hourlySection.append(element)
    i++
  }

  //hourly.forEach(hour => {

  //const element = hourRowTemplate.content.cloneNode(true)
  //setValue("temp", hour.temp, { parent: element })
  //setValue("fl-temp", hour.feelsLike, { parent: element })
  //setValue("wind", hour.windSpeed, { parent: element })
  //setValue("precip", hour.precip, { parent: element })
  //setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element })
  //setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element })
  //element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
  //hourlySection.append(element)





  //})


}

