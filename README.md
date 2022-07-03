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