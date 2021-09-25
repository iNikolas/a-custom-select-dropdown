export default class Select {
  constructor(element) {
    this.element = element;
    this.liOptions = getFormattedOptions(element.querySelectorAll("option"));
    this.divContainer = document.createElement("div");
    this.spanSelected = document.createElement("span");
    this.ulOptionsContainer = document.createElement("ul");
    setupCustomElement(this);
    element.style.display = "none";
    element.after(this.divContainer);
  }

  get selectedOption() {
    return this.liOptions.find((option) => option.selected);
  }
  get selectedOptionIndex() {
    return this.liOptions.indexOf(this.selectedOption);
  }
  selectValue(value) {
    const newSelectedOption = this.liOptions.find(
      (option) => option.value === value
    );
    const prevSelectedOption = this.selectedOption;
    prevSelectedOption.selected = false;
    prevSelectedOption.element.selected = false;
    newSelectedOption.selected = true;
    newSelectedOption.element.selected = true;
    this.spanSelected.innerText = this.selectedOption.label;
    this.ulOptionsContainer
      .querySelector(`[data-value="${prevSelectedOption.value}"]`)
      .classList.remove("selected");
    const newCustomElement = this.ulOptionsContainer.querySelector(
      `[data-value="${newSelectedOption.value}"]`
    );
    newCustomElement.classList.add("selected");
    newCustomElement.scrollIntoView({ block: "nearest" });
  }
}

function setupCustomElement(select) {
  select.divContainer.classList.add("custom-select-container");
  select.divContainer.tabIndex = 0;
  select.spanSelected.classList.add("custom-select-value");
  select.spanSelected.innerText = select.selectedOption.label;
  select.ulOptionsContainer.classList.add("custom-select-options");
  select.divContainer.append(select.spanSelected);
  select.divContainer.append(select.ulOptionsContainer);
  select.liOptions.forEach((option) => {
    const optionElement = document.createElement("li");
    optionElement.classList.add("custom-select-option");
    optionElement.classList.toggle("selected", option.selected);
    optionElement.innerText = option.label;
    optionElement.dataset.value = option.value;
    optionElement.onclick = () => {
      select.selectValue(option.value);
    };
    select.ulOptionsContainer.append(optionElement);
  });

  select.divContainer.onclick = () =>
    select.ulOptionsContainer.classList.toggle("show");
  select.divContainer.onblur = () =>
    select.ulOptionsContainer.classList.remove("show");
  let debounceTimeout;
  let searchTerm = "";
  select.divContainer.onkeydown = (event) => {
    switch (event.code) {
      case "Space":
      case "Enter":
        select.ulOptionsContainer.classList.toggle("show");
        break;
      case "ArrowUp": {
        const prevOption = select.liOptions[select.selectedOptionIndex - 1];
        if (prevOption) select.selectValue(prevOption.value);
        break;
      }
      case "ArrowDown": {
        const newOption = select.liOptions[select.selectedOptionIndex + 1];
        if (newOption) select.selectValue(newOption.value);
        break;
      }
      case "Escape":
        select.ulOptionsContainer.classList.remove("show");
        break;
      default: {
        clearTimeout(debounceTimeout);
        searchTerm += event.key;
        debounceTimeout = setTimeout(() => (searchTerm = ""), 500);
        const searchedOption = select.liOptions.find((option) =>
          option.label.toLowerCase().startsWith(searchTerm)
        );
        if (searchedOption) select.selectValue(searchedOption.value);
      }
    }
  };
}

function getFormattedOptions(optionElements) {
  return [...optionElements].map((optionElement) => {
    return {
      value: optionElement.value,
      label: optionElement.label,
      selected: optionElement.selected,
      element: optionElement,
    };
  });
}
