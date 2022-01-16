#!/usr/bin/env zx

$.verbose = false;

let hosts = require("/var/opt/hosts.json");

/**
 * host:
 *   ip: 10.0.0.16
 *   name: saned.local
 *   up: false
 */

hosts = await Promise.all(hosts.map(async host => {
  let newState = false;

  try {
    newState = 0 === (await $`ping -c 1 -W 1 ${host.ip}`).exitCode;
  } catch (e) {}

  if (newState !== host.up) {
    report(`${host.name} went ${newState ? "UP" : "DOWN"}.`);
  }

  return { ...host, up: newState, };
}));

fs.writeFileSync('/var/opt/hosts.json', JSON.stringify(hosts), 'utf-8')

////////

function report(msg) {
  $`echo ${msg} | telegram-send --stdin`;
}
