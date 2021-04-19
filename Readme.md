# Multiplayer Minesweeper

This is a side project for fun. It's just barely playable again.

* Use `go build` to build the app.
* Use `go run .` to build and run.
* I use `watchexec -r go run .` to restart the app when files change.
* Use `go test` in one of the directories to run `_test.go` unit tests.

It's currently [hosted on a free Heroku dyno](https://aqueous-atoll-41713.herokuapp.com/).

# How is the multiplayer going to work?

I don't know all the details yet. Right now, each player plays on their own separate
minefield, but with a catch: even if you open a square, you can only see the number if all
other players have also opened that square. Co-op minesweeper.

When a player hits a mine, they can keep going. I'm not planning to make the game do anything
for "winning" or "losing" yet.

I don't know if it'll be fun to play like this. It might not scale beyond three or four players,
and not being able to advance your own game might be frustrating. Minesweeper is traditionally
very individual and algorithmic. We shall see.

# Tech Choices

Originally, I was writing this in JavaScript. (Git branch `js-historical`.) I decided to rewrite it,
as I tend to do with personal projects.

I decided to rewrite it in a dynamic language. "Hey, I know Python, and I could use Django." Nope.
I started rewriting it in Django, but I didn't get very far. I didn't like Django's "magic."

## Go, Turbo, and Tachyons

I read some articles about Go recently, and I felt inspired to try using it again. It's been a long time,
and I believe I'm a much better programmer now. After having worked in it for a few hours,
I'm glad to be back. Go is a simple, powerful language.

Since I occasionally follow DHH and Basecamp topics, I came across Hotwire and Turbo. The approach makes
a lot of sense to me, and I decided to give it a try. So far, it's been smooth and fast. I like how much
I've been able to create so far without using any JavaScript.

I stumbled across Tailwind CSS recently while working at my day job. At first, I thought the utility-first
approach was crazy, but I became intrigued. The main appeal to me is not having to name any CSS classes.
Naming things is hard. But, I don't want to use Tailwind because it essentially requires a build step.
I decided to try Tachyons instead. So far, it feels powerful, but kind of clunky and outdated at the same time.
The docs are confusing sometimes.

## Original choices

Mithril caught my attention as a minimalist JS framework that doesn't require a build step.
It seems well-supported, and I like the documentation. It's different and new to me. /shrug

Express seems like the simplest way to run an HTTP server that interoperates with client-side JS.
I could have used .NET Core or Go, but I want to try this. It's been a long time since I tried
using Express, and I didn't understand it then, but I'm a better programmer now. I think I can use it.
