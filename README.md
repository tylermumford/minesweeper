# Multiplayer Minesweeper

This is a side project for fun. It's playable—just know that the game design is undergoing changes.

The front-end build is handled by Parcel, and is most easily used via npm scripts.
Install dependencies and run `npm start` to build everything and start the server.

* Install packages: `npm install`
* Build and start the app: `npm start`
* Watch for changes: `npm run live`
* Run tests: `npm test` and `npm run test:watch`
* Deploy: `git push heroku [branch-name]`
* See `package.json` for more.

All of the client-side code is in the `frontend` directory.

It's currently hosted on a [free Heroku dyno](https://aqueous-atoll-41713.herokuapp.com/).

# How is the multiplayer going to work?

I don't know all the details yet. Right now, each player plays on their own separate
minefield, but with a catch: even if you open a square, you can only see the number if all
other players have also opened that square. Co-op minesweeper.

When a player hits a mine, they can keep going. I'm not planning to make the game do anything
for "winning" or "losing" yet.

I don't know if it'll be fun to play like this. It might not scale beyond three or four players,
and not being able to advance your own game might be frustrating. Minesweeper is traditionally
very individual and algorithmic. We shall see.

# Why Mithril and Express?

Mithril caught my attention as a minimalist JS framework that doesn't require a build step.
It seems well-supported, and I like the documentation. It's different and new to me. /shrug

Express seems like the simplest way to run an HTTP server that interoperates with client-side JS.
I could have used .NET Core or Go, but I want to try this. It's been a long time since I tried
using Express, and I didn't understand it then, but I'm a better programmer now. I think I can use it.
