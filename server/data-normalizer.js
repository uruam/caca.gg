import fetchGamesData from "./data-fetcher.js";

const hasBotPlayers = (players) =>
  players.some((player) => player.isbot === true);

const initWeaponEntries = (weapons) => {
  const updatedWeapons = { ...(weapons || {}) };
  Array.from({ length: 8 }, (_, i) => i + 1).forEach((weaponId) => {
    updatedWeapons[weaponId] = updatedWeapons[weaponId] || {
      kills: 0,
      shots: 0,
      hits: 0,
      damage: 0,
    };
  });

  return updatedWeapons;
};

const calculateTotalAcc = (weapons) => {
  const { totalShots, totalHits } = Object.values(weapons).reduce(
    (acc, weapon) => {
      acc.totalShots += weapon.shots;
      acc.totalHits += weapon.hits;

      return acc;
    },
    { totalShots: 0, totalHits: 0 },
  );

  const totalAcc =
    Math.round((totalHits * 100) / (totalShots || totalHits)) || 0;

  return totalAcc;
};

const normalizeData = async () => {
  try {
    const gamesDataResponses = await fetchGamesData();

    if (gamesDataResponses === undefined) {
      return console.error("normalizeData: gamesDataResponses undefined");
    }

    const [firstGame] = gamesDataResponses;
    const [lastGame] = gamesDataResponses.slice(-1);
    const from = firstGame.time;
    const till = lastGame.time;
    const period = { from, till };
    let amountOfGamesNoBots = 0;

    const playersStats = {};

    gamesDataResponses.forEach((game) => {
      // Skip games with bots
      if (hasBotPlayers(game.players)) return;
      amountOfGamesNoBots += 1;

      // Determine the winning team
      // team 1 is red, team 2 is blue
      const winningTeam = game.score_red > game.score_blue ? 1 : 2;

      // Parse player stats for the current game
      game.players.forEach((player) => {
        const playerName = player.name;
        const isBot = player.isbot;
        const isAnon = player.isanon;

        if (!isBot && !isAnon) {
          if (playersStats[playerName]) {
            // If the player already exists in the stats object,
            // update the stats
            playersStats[playerName].score += player.score;

            playersStats[playerName].time += player.playtime;

            playersStats[playerName].wins +=
              player.team === winningTeam ? 1 : 0;

            playersStats[playerName].losses +=
              player.team !== winningTeam ? 1 : 0;

            playersStats[playerName].wlr =
              playersStats[playerName].losses > 0
                ? playersStats[playerName].wins /
                  playersStats[playerName].losses
                : playersStats[playerName].wins;

            playersStats[playerName].kills += player.kills;

            playersStats[playerName].deaths += player.deaths;

            playersStats[playerName].kdr =
              playersStats[playerName].deaths > 0
                ? playersStats[playerName].kills /
                  playersStats[playerName].deaths
                : playersStats[playerName].kills;

            playersStats[playerName].dg += player.damage_given;

            playersStats[playerName].dt += player.damage_taken;

            playersStats[playerName].dgdtr =
              playersStats[playerName].dt > 0
                ? playersStats[playerName].dg / playersStats[playerName].dt
                : playersStats[playerName].dg;

            Object.keys(player.weapons).forEach((weaponId) => {
              if (!playersStats[playerName].weapons) {
                playersStats[playerName].weapons = {};
              }

              if (!playersStats[playerName].weapons[weaponId]) {
                playersStats[playerName].weapons[weaponId] = {
                  kills: 0,
                  shots: 0,
                  hits: 0,
                  damage: 0,
                };
              }

              playersStats[playerName].weapons[weaponId].kills +=
                player.weapons[weaponId].kills;

              playersStats[playerName].weapons[weaponId].shots +=
                player.weapons[weaponId].shots;

              playersStats[playerName].weapons[weaponId].hits +=
                player.weapons[weaponId].hits;

              playersStats[playerName].weapons[weaponId].damage +=
                player.weapons[weaponId].damage;
            });

            Object.keys(player.awards).forEach((award) => {
              if (!playersStats[playerName].awards) {
                playersStats[playerName].awards = {};
              }
              if (!playersStats[playerName].awards[award]) {
                playersStats[playerName].awards[award] = 0;
              }
              playersStats[playerName].awards[award] += player.awards[award];
            });

            playersStats[playerName].acc = calculateTotalAcc(
              playersStats[playerName].weapons,
            );
          } else {
            // If the player doesn't exist in the stats object, add a new entry
            playersStats[playerName] = {
              name: playerName,
              score: player.score,
              time: player.playtime,
              wins: player.team === winningTeam ? 1 : 0,
              losses: player.team !== winningTeam ? 1 : 0,
              wlr: player.team === winningTeam ? 1 : 0,
              kills: player.kills,
              deaths: player.deaths,
              kdr:
                player.deaths > 0 ? player.kills / player.deaths : player.kills,
              dg: player.damage_given,
              dt: player.damage_taken,
              dgdtr:
                player.damage_taken > 0
                  ? player.damage_given / player.damage_taken
                  : player.damage_given,
              weapons: initWeaponEntries(player.weapons),
              awards: player.awards,
              acc: calculateTotalAcc(initWeaponEntries(player.weapons)),
              period,
            };
          }
        }
      });
    });

    const playersStatsArray = Object.values(playersStats).sort(
      (a, b) => b.score - a.score,
    );

    console.log("Games altogether:", gamesDataResponses.length);
    console.log("Games without bots:", amountOfGamesNoBots);
    console.log("Nicknames:", playersStatsArray.length);

    return playersStatsArray;
  } catch (error) {
    console.error("Error normalizing data ", error);
  }

  return null;
};

export default normalizeData;
