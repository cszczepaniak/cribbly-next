# Cribbly

This is like, the fifth try at this. But I feel _really good_ about it this time! This is the source for Cribbly, the website that runs the Szczepaniak annual cribbage tournament.

## Development

To develop locally:

```
npm run dev
```

To run locally, you should connect to a database.

#### Database

You must be connected to a MySQL database. That can be MySQL directly, a docker container, or a database in the cloud. You simply need to have a `.env` file in the root of this repository with an appropriate database URL. See [`.env-example`](.env-example) for more.

## TODO

- [ ] Create admin section
  - [x] Require login for auth section (Google auth, maybe?)
    - [x] Only allow certain users to access auth (so not just anyone can sign up with Google)
  - [ ] Be able to create players
  - [ ] Be able to create teams
  - [ ] Be able to put players on teams
  - [ ] Be able to create divisions
  - [ ] Be able to add teams to divisions
  - [ ] Admin "seed tournament" action
  - [ ] Import players/teams/etc. from CSV?
  - [ ] Export printable QR code PDF for all prelim games

- [ ] Create public game page
  - [ ] Page that shows the game and allows reporting the result if it's not complete yet

- [ ] Create public prelim results page
  - [ ] Page that shows the current prelim results
    - [ ] Maybe we want to cache this for ~a minute so several people can get it without having to hit the db every time


- [ ] Once tournament is seeded:
  - [ ] Create public tournament page
    - [ ] At this point, we should probably also disable/replace the "view prelim standings" button on the home page