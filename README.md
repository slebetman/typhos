# ![Logo](https://github.com/slebetman/typhos/raw/master/Typhos-Logo.png) Typhos

Fast, load-balancing, front-end proxy for microservices

[![Build Status](https://travis-ci.org/slebetman/typhos.svg?branch=master)](https://travis-ci.org/slebetman/typhos)

## It's basically a proxy...

Typhos aims to be a fast, lightweight HTTP proxy. It aims to provide two primary features:

1. Route HTTP requests to the right server

2. Provide load balancing

The problem with normal reverse-proxy setups is that it's difficult or impossible to
implement load balancing on a per-server basis.

The problem with load balancers is that they usually don't do routing.

So Typhos was born.

## Configuration

Typhos is almost entirely configured via a simple HTTP based API. This allows
configuration to be changed without restarting the server. This is useful in
environments where services are provisioned and shut down dynamically.

### /list

Returns a list of all active paths and servers

### /add?path={routing_path}&server={server_url}

Adds a server to the proxy. If the routing path does not exist it will be created.

### /remove?path={routing_path}&server={server_url}

Removes a server from a routing path.



