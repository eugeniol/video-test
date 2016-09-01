const url = require("url")
const path = require("path")
const fs = require("fs")

module.exports = (app) => {
    app.get("/v/:id", getVideo)

}

function getVideo(req, res) {
    var file = path.resolve(__dirname, "../data/video.mp4");

    console.log(req.params.id)

    fs.stat(file, function (err, stats) {
        if (err) {
            if (err.code === 'ENOENT') {
                // 404 Error if file not found
                return res.sendStatus(404);
            }
            res.end(err);
        }
        console.log(req.headers)
        var range = req.headers.range;
        if (!range) {
            // 416 Wrong range
            return res.sendStatus(416);
        }
        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = (end - start) + 1;

        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
        });

        var stream = fs.createReadStream(file, {start: start, end: end})
            .on("open", function () {
                stream.pipe(res);
            }).on("error", function (err) {
                res.end(err);
            });
    });
}

