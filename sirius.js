const fs = require('node:fs')
const path = require('node:path')
const { Mirai } = require('mirai-ts')
const yaml = require('js-yaml')
const { glob } = require('glob')
const prompt = require("prompt-sync")({ sigint: true })

const qq = prompt("Enter QQ: ")

const setting = yaml.load(
  fs.readFileSync(
    path.resolve(
      __dirname,
      '../bot/mirai/mirai/config/net.mamoe.mirai-api-http/setting.yml',
    ),
    'utf8',
  ),
)

const mirai = new Mirai(setting)

async function loadPlugins(mirai) {
  files = await glob("plugins/**/index.js")
  files.forEach(f => {
    plugin = require(path.resolve(f))
    Object.keys(plugin).forEach(func => {
      plugin[func](mirai)
    })
  })
}

async function app() {
  await mirai.link(qq)
  await loadPlugins(mirai)

  mirai.listen((msg) => {
    console.log(msg)
  })
}

app()
