const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const request = require("request")
const accessToken = "0df5dc9a451071f06dfa5207725021ba56c75e85"
const id = "20905149"

var port = process.env.PORT || 4000

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))




app.get("/", function (req, res) {
    let url = "https://www.strava.com/api/v3/athlete?access_token="+accessToken
    request(url, function (err, response, body) {
        if (err) {
            res.render("index", { athlete: null, error: "Error, error"})
        } else {
            let athlete = JSON.parse(body)
            if (athlete == undefined) {
                res.render("index", { athlete: null, error: "Error, undefinded" })
            } else {
                let athleteData = "It's "+ athlete.firstname + " from " + athlete.city +"!"
                res.render("index", { athlete: athleteData, error: null })
            }
        }
    })
})

app.get("/chartistTest", function (req, res) {
    let url = "https://www.strava.com/api/v3/athlete/activities?per_page=15&access_token="+accessToken
    var distArr = []
    var dateArr = []
    var activityCounter = 0
    request(url, function (err, response, body) {
        let activities = JSON.parse(body)

        for (var i = 0, len = activities.length; i < len; i++) {
            if (activityCounter > 12)
                break
            if (activities[i].type === "Run") {
                distArr.push((activities[i].distance / 1000).toFixed(2))
                var dateFormat = new Date(activities[i].start_date)
                var output = formatDate(dateFormat)
                dateArr.push(output)
            }
        }
        res.render("chartist", { distArr: distArr, dateArr: dateArr })
    })
})

app.get("/stats", function (req, res) {
    let url = "https://www.strava.com/api/v3/athletes/"+id+"/stats?access_token="+accessToken
    request(url, function (err, response, body) {
        if (err) {
            res.render("stats", { athlete: null, error: "Error, error" })
        } else {
            let athlete = JSON.parse(body)
            if (athlete == undefined) {
                res.render("stats", { athlete: null, error: "Error, undefinded" })
            } else {
                let runStats = "Przebiegłeś "+(athlete.recent_run_totals.distance / 1000).toFixed(2)+"km, a biegałeś "+athlete.recent_run_totals.count+ "razy!"
                let rideStats = "Na rowerze przejechałeś "+(athlete.recent_ride_totals.distance / 1000).toFixed(2)+"km, a jeżdziłeś "+athlete.recent_ride_totals.count+" razy!"
                res.render("stats", {
                    runStats: runStats,
                    rideStats: rideStats,
                    runCount: athlete.all_run_totals.count,
                    rideCount: athlete.all_ride_totals.count,
                    swimCount: athlete.all_swim_totals.count,
                    error: null
                })
            }
        }
    })
})

function formatDate(d) {
    var month = d.getMonth()
    var day = d.getDate().toString()
    var year = d.getFullYear()
    year = year.toString().substr(-2)
    month = (month + 1).toString()

    if (month.length === 1) {
        month = "0" + month
    }
    if (day.length === 1) {
        day = "0" + day
    }
    return month + "/" + day + "/" + year
}

app.listen(port, function () {})