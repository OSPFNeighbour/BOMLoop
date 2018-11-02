const radarID = 713 //ID of radar loop
const imagePeriod = 6 //period between each radar image in minutes
const frameDelay = 700 //time between frame in milliseconds

var imageBase = 'http://www.bom.gov.au/radar/IDR' + radarID + '.T.'
var bufferSize = 5
var ImageLoop = []
var pauseLoop = false



preLoadRadarImages()

setInterval(manageRadarImages, 60000)
setInterval(loopRadarImages, frameDelay)

function preLoadRadarImages() {
  console.log("fetching " + bufferSize + " images")
  var baseDate = new moment()
  baseDate.seconds(0)
  baseDate.subtract(imagePeriod, 'minutes')
  baseDate.minutes(Math.floor(baseDate.utc().minutes() / imagePeriod) * imagePeriod)
  for (i = 0; i < bufferSize; i++) {
    baseDate.subtract(imagePeriod, "minutes")
    const imageURL = imageBase + baseDate.format('YYYYMMDDHHmm') + ".png"
    const imageId = baseDate.format('YYYYMMDDHHmm')
    const localTime = baseDate.clone()
    localTime.local()
    ImageLoop.push({
      id: imageId,
      url: imageURL,
      timeStamp: localTime.toString()
    })
  }
}

function manageRadarImages() {
  var baseDate = new moment()
  baseDate.seconds(0)
  baseDate.subtract(imagePeriod, 'minutes')
  baseDate.minutes(Math.floor(baseDate.utc().minutes() / imagePeriod) * imagePeriod)
  const imageURL = imageBase + baseDate.format('YYYYMMDDHHmm') + ".png"
  const imageId = baseDate.format('YYYYMMDDHHmm')
  const localTime = baseDate.clone()
  localTime.local()
  if (ImageLoop[0].id < imageId) {
    console.log("adding newer image,", imageURL)
    ImageLoop.unshift({
      id: imageId,
      url: imageURL,
      timeStamp: localTime.toString()
    })
    console.log("removing oldest image,", ImageLoop.pop().url);
  }
}


function loopRadarImages() {
  for (i = ImageLoop.length - 1; i >= 0; i--) {
    if ($("#overlayLoop").attr("src") == '') {
      console.log('first run, setting first image')
      $("#overlayLoop").attr("src", ImageLoop[ImageLoop.length - 1].url)
      $("#timestamp").text(ImageLoop[ImageLoop.length - 1].timeStamp)
      break
    }
    if (ImageLoop[i].url == $("#overlayLoop").attr("src")) {
      if (i == 0) {
        if (pauseLoop == true) {
          pauseLoop = false
          $("#overlayLoop").attr("src", ImageLoop[ImageLoop.length - 1].url)
          $("#timestamp").text(ImageLoop[ImageLoop.length - 1].timeStamp)
          console.log("current url", $("#overlayLoop").attr("src"))
        } else {
          pauseLoop = true
          console.log("pausing for one cycle as its the last frame of the loop")
        }
      } else {
        pauseLoop = false
        $("#overlayLoop").attr("src", ImageLoop[i - 1].url)
        $("#timestamp").text(ImageLoop[i - 1].timeStamp)
        console.log("current url", $("#overlayLoop").attr("src"))
      }
      break
    }
  }
}
