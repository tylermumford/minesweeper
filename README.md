# Multiplayer Minesweeper

This is a side project for fun. It's not playable yet.

There is no build step. Install dependencies and run `npm start` to start the server, which serves plain JavaScript files. Pretty old school.

* `npm test`
* `npm start`

I'm planning to host it on Heroku when it's more playable.

# How is the multiplayer going to work?

I'm not sure. Right now, I think it's going to involve each player playing on their own separate
minefield, but with a catch: even if you reveal a square, you can only see the number if all
other players have revealed that square. Co-op minesweeper.

I don't know if it'll be fun to play like this. It certainly doesn't seem like it will scale beyond
two or three players, and not being able to advance your own game might be frustrating. Minesweeper
is traditionally very individual and algorithmic. We shall see.

# Why Mithril and Express?

Mithril caught my attention as a minimalist JS framework that doesn't require a build step.
It seems well-supported, and I like the documentation. It's different and new to me. /shrug

Express seems like the simplest way to run an HTTP server that interoperates with client-side JS.
I could have used .NET Core or Go, but I want to try this. It's been a long time since I tried
using Express, and I didn't understand it then, but I'm a better programmer now. I think I can use it.
