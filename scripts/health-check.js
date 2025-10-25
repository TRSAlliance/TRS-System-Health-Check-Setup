/**
 * 🩺 TRS Alliance System Health Check v2.5
 * Enhanced Integration Heartbeat Module
 * Author: TRSAlliance
 */

const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const chalk = require("chalk");
const config = require("../health-check.config.js");

const REPORT_DIR = path.resolve(".");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const reportFile = path.join(REPORT_DIR, `health-check-${timestamp}.json`);

const log = (symbol, colorFn, msg) => console.log(colorFn(symbol + " " + msg));

async function checkEndpoint(endpoint) {
  const name = endpoint.name || endpoint.url;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeout);
  const start = Date.now();

  try {
    const headers = {};
    if (endpoint.auth && process.env[endpoint.auth]) {
      headers["apikey"] = process.env[endpoint.auth];
    }

    const response = await fetch(endpoint.url, { headers, signal: controller.signal });
    const duration = Date.now() - start;

    if (response.ok) {
      if (duration < 1000) log("✅", chalk.green, `${name} [${duration}ms] OK`);
      else log("⚠️", chalk.yellow, `${name} [${duration}ms] Slow`);
      return { name, status: "HEALTHY", duration, code: response.status };
    } else {
      log("❌", chalk.red, `${name} [${response.status}] Failed`);
      return { name, status: "FAILED", duration, code: response.status };
    }
  } catch (err) {
    log("🚨", chalk.redBright, `${name} Unreachable (${err.message})`);
    return { name, status: "UNREACHABLE", duration: null, error: err.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function runHealthCheck() {
  console.log(chalk.cyan.bold("\n🩺 TRS Alliance System Health Check\n"));
  const results = [];
  let healthy = 0, warn = 0, fail = 0;

  for (const endpoint of config.endpoints) {
    const res = await checkEndpoint(endpoint);
    results.push(res);
    if (res.status === "HEALTHY") healthy++;
    else if (res.status === "FAILED") fail++;
    else warn++;
  }

  const summary = {
    overall:
      fail > 0 ? "CRITICAL" :
      warn > 0 ? "MOSTLY_HEALTHY" : "HEALTHY",
    timestamp: new Date().toISOString(),
    componentsChecked: results.length,
    healthy,
    warn,
    fail,
    integrations: Object.fromEntries(results.map(r => [r.name, r]))
  };

  fs.writeFileSync(reportFile, JSON.stringify(summary, null, 2));
  console.log(chalk.magenta(`\n📁 Report saved → ${reportFile}`));

  if (summary.overall === "CRITICAL") process.exitCode = 1;
}

runHealthCheck();
