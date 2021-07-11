### Run init On the first time

### First Time

```bash
yarn build
yarn init-database
```

### setup routine crwaler

```bash
pm2 start yarn --name crawler -- start
```

### Make it work on droplet

```bash
sudo apt-get install -y libgbm-dev
```
