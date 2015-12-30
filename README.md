# Multi Pip-Boy

[![Docker Pulls](https://img.shields.io/docker/pulls/rgbkrk/multipipboy.svg)](https://hub.docker.com/r/rgbkrk/multipipboy/)

Multi-player map for Fallout 4. You, your friends, people around the world.

![yay for dots](https://cloud.githubusercontent.com/assets/836375/11960060/5b49ac9c-a896-11e5-8e50-da9ce4330e1d.gif)

## Deployment

Assuming you have a [nice place to run Docker images](https://getcarina.com), run

```
docker run --name multi --restart=always -p 80:8080 -d rgbkrk/multipipboy
```

If your host has a domain, have players point their pipboyrelay to it. Otherwise, use `docker port` to find out where it's serving.

```
$ docker port multi 8080
172.99.78.157:8000
```

Then have players connect their `pipboyrelay` up to your running server.

(TODO: Add an argument on to `pipboyrelay`)

## Development

Clone it and `npm install`.

### Run the dev server

```
$ npm run dev
```

Hackity hack away.
