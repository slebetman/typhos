# Typhos

![Logo](https://github.com/slebetman/typhos/raw/master/Typhos-Logo.png)

[![Build Status](https://travis-ci.org/slebetman/typhos.svg?branch=master)](https://travis-ci.org/slebetman/typhos)

Fast, load-balancing, front-end proxy for microservices

## It's basically a proxy...

Typhos aims to be a fast, lightweight HTTP proxy. It aims to provide two primary features:

1. Route HTTP requests to the right server

2. Provide load balancing

The problem with normal reverse-proxy setups is that it's difficult or impossible to
implement load balancing on a per-server basis.

The problem with load balancers is that they usually don't do routing.

So Typhos was born.

