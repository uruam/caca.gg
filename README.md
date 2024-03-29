# [caca.gg](https://caca.gg)

Web-based application designed to provide a comprehensive scoreboard and player profiles with detailed statistics for a RatMod Clan Arena game server. It allows users to effortlessly access both the overall game statistics and individual player metrics from the last 30 days, enhancing their gaming experience.

## Requirement

[Node.js](https://nodejs.org) 8.3.0 or higher.

## Installation

To run the project locally:

Clone the repository

```
git clone https://github.com/uruam/caca.gg.git
```

Navigate to the client folder

```
cd caca.gg/client
```

Install dependencies

```
npm install
```

Transcompile and bundle the client code

```
npm run build
```

Navigate to the server directory

```
cd ../server
```

Install server dependencies

```
npm install
```

Start the server

```
npm run start
```

## Usage

The server will be running locally on port 3000. Access the application by opening a web browser and going to [http://localhost:3000](http://localhost:3000).

## Code Style

The project utilizes ESLint and Prettier for code linting and formatting. While these tools are integrated into the build process for the client using webpack, the server code needs to be linted separately.

Steps:

After editing the server code, navigate to the server directory

```
cd server
```

Run ESLint to check for any code style violations

```
npm run lint
```

Resolve any reported issues based on ESLint's recommendations

## Credits

icons: [RatMod authors](https://ratmod.github.io)

oaquery: [Rodent Control](https://github.com/rdntcntrl)

## License

This project is licensed under the [GPL-2.0 license](https://github.com/uruam/caca.gg#GPL-2.0-1-ov-file).
