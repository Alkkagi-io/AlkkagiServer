#!/usr/bin/env bash
set -euo pipefail

DOMAIN="alkkagidev.plasticpipe.tube"
SRC="/etc/letsencrypt/live/${DOMAIN}"
DST="${PWD}/certs/${DOMAIN}"

sudo mkdir -p "$DST"
sudo install -m 600 -o "$USER" -g staff "${SRC}/privkey.pem"   "${DST}/privkey.pem"
sudo install -m 644 -o "$USER" -g staff "${SRC}/fullchain.pem" "${DST}/fullchain.pem"