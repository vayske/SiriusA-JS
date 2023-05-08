const axios = require("axios")
const cheerio = require("cheerio")
const { check, Message } = require("mirai-ts")

const pattern = "http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+#]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+"
const titleTag = "[property='og:title']"
const imageTag = "[property='og:image']"
const urlTag = "[property='og:url']"

function link_preview(mirai) {
    mirai.on("GroupMessage", (msg) => {
        let url = check.re(msg.plain, pattern)
        if (url) {
            axios.get(url[0]).then((html) => {
                let $ = cheerio.load(html.data)
                let title = $(titleTag).attr("content")
                let image = $(imageTag).attr("content")
                let link = $(urlTag).attr("content")
                if (title && link) {
                    let message = []
                    if (image) {
                        if (!image.includes("https:")) {
                            image = "https:" + image
                        }
                        if (image.includes("@")) {
                            image = image.split("@")[0]
                        }
                        message.push(Message.Image('', image))
                    }
                    message.push(Message.Plain(`${title} ${link}`))
                    msg.reply(message)
                }
            })
        }
    })
}

module.exports = { link_preview }
