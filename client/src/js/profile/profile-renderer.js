import {
  formatNumber,
  formatTime,
  formatPeriod,
  formatBoardHeader,
  formatBoardCellContent,
  formatWeaponsStatsHeaderName,
} from "../utils/format.js";
import { getMedalImg, getMedalDescription } from "../utils/get-medal-data.js";
import { colorizeText } from "../utils/colorize.js";
import getWeaponImg from "../utils/get-weapon-img.js";
import calculateAcc from "../utils/calculate-acc.js";

const generateTotalStats = (data) => {
  const table = document.createElement("table");
  table.id = "profileTotal";

  const excludedKeys = ["name", "skill", "time", "period", "weapons", "awards"];
  const keys = Object.keys(data).filter((key) => !excludedKeys.includes(key));

  const header = table.createTHead();
  const headerRow = header.insertRow();
  keys.forEach((key) => {
    const th = document.createElement("th");
    th.textContent = formatBoardHeader(key);
    headerRow.appendChild(th);
  });

  const body = table.createTBody();
  const row = body.insertRow();
  keys.forEach((key) => {
    const cell = row.insertCell();
    cell.textContent = formatBoardCellContent(key, data[key]);
  });

  return table;
};

const generateWeaponsStats = (weaponsData) => {
  const table = document.createElement("table");
  table.id = "profileWeapons";

  const header = table.createTHead();
  const headerRow = header.insertRow();

  const firstTh = document.createElement("th");
  firstTh.textContent = "💀";
  headerRow.appendChild(firstTh);

  const keys = Object.keys(Object.values(weaponsData)[0]);
  keys.forEach((key) => {
    const th = document.createElement("th");
    th.textContent = formatWeaponsStatsHeaderName(key);
    headerRow.appendChild(th);
  });

  const accTh = document.createElement("th");
  accTh.textContent = "ACC";
  headerRow.appendChild(accTh);

  const body = table.createTBody();
  Object.keys(weaponsData).forEach((key, index) => {
    const row = body.insertRow();
    const weaponCell = row.insertCell();
    const weaponImage = new Image();
    weaponImage.src = getWeaponImg(index);
    weaponCell.appendChild(weaponImage);

    Object.values(weaponsData[key]).forEach((value) => {
      const dataCell = row.insertCell();
      dataCell.textContent = formatNumber(value);
    });

    const accCell = row.insertCell();
    accCell.textContent = `${calculateAcc(weaponsData[key])}%`;
  });

  return table;
};

const generateMedalsStats = (medalsData) => {
  const medalsContainer = document.createElement("div");
  medalsContainer.id = "profileMedalsContainer";

  Object.keys(medalsData).forEach((key) => {
    const medalContainer = document.createElement("div");
    medalContainer.id = "profileMedalContainer";
    medalContainer.setAttribute("tooltip", getMedalDescription(key));

    const medalImage = new Image();
    medalImage.src = getMedalImg(key);
    medalImage.id = "profileMedalImage";
    medalContainer.appendChild(medalImage);

    const medalData = document.createElement("div");
    medalData.id = "profileMedalDataWrapper";
    medalData.innerText = medalsData[key];
    medalContainer.appendChild(medalData);

    medalsContainer.appendChild(medalContainer);
  });

  return medalsContainer;
};

const renderProfile = (data) => {
  const someText = document.getElementById("someText");
  const contentContainer = document.getElementById("contentContainer");

  const playerName = document.createElement("div");
  playerName.id = "profilePlayerName";
  const playerNameWrapper = document.createElement("div");
  playerNameWrapper.id = "profilePlayerNameWrapper";
  playerName.appendChild(playerNameWrapper);

  const playerSkill = document.createElement("div");
  playerSkill.id = "profilePlayerSkill";

  const playerTime = document.createElement("div");
  playerTime.id = "profilePlayerTime";

  const weaponsHeader = document.createElement("div");
  weaponsHeader.id = "profileWeaponsHeader";

  const medalsHeader = document.createElement("div");
  medalsHeader.id = "profileMedalsHeader";

  // Clear container before rendering
  someText.innerText = "";
  contentContainer.innerHTML = "";

  if (data.error) {
    someText.innerText = "";

    if (data.error === "Data file not found") {
      contentContainer.innerText = "No data for the profile";

      return;
    }
    contentContainer.innerText = "There's some problem, we're on it";

    return;
  }
  someText.innerText = formatPeriod(data.period);

  playerNameWrapper.innerHTML = colorizeText(data.name);
  contentContainer.appendChild(playerName);

  playerSkill.innerHTML = `skill: ${data.skill}`;
  contentContainer.appendChild(playerSkill);

  playerTime.innerHTML = `time: ${formatTime(data.time)}`;
  contentContainer.appendChild(playerTime);

  contentContainer.appendChild(generateTotalStats(data));

  contentContainer.appendChild(weaponsHeader);
  contentContainer.appendChild(generateWeaponsStats(data.weapons));

  contentContainer.appendChild(medalsHeader);
  contentContainer.appendChild(generateMedalsStats(data.awards));
};

export default renderProfile;
