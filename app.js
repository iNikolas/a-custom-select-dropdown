import Select from "./select.js";
import cities from "./citiesList.js";

const selectElements = document.querySelectorAll("[data-custom]");

cities.split("\n").forEach((city, index) => {
  const option = document.createElement("option");
  const valueLength = city.indexOf(" ");
  const optionValue = city.substr(0, valueLength);
  option.value = optionValue;
  option.innerHTML = city;
  if (index === 6) option.defaultSelected = true;
  selectElements[0].appendChild(option);
});

selectElements.forEach((selectElement) => {
  new Select(selectElement);
});
