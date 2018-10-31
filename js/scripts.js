
var radarID = 713

var imageBase = 'http://www.bom.gov.au/radar/IDR'+radarID+'.T.'
var bufferSize = 5
var ImageLoop = []
var pauseLoop = false



preLoadRadarImages()

$("#overlayLoop").attr("src", ImageLoop[ImageLoop.length - 1].url)

setInterval(manageRadarImages, 60000)
setInterval(loopRadarImages, 700)

function preLoadRadarImages() {
  console.log("fetching " + bufferSize + " images")
  for (i = 0; i < bufferSize; i++) {
    var baseDate = new Date()
    baseDate.setMinutes(baseDate.getMinutes() - 6);

    var imageDate = new Date(baseDate.valueOf() + baseDate.getTimezoneOffset() * 60000);
    imageDate.setMinutes((Math.floor(imageDate.getMinutes() / 6) * 6) - i * 6)
    var imageURL = imageBase + moment(imageDate).format('YYYYMMDDHHmm') + ".png"
    var imageId = moment(imageDate).format('YYYYMMDDHHmm')
    console.log(imageURL)
    ImageLoop.push({
      id: imageId,
      url: imageURL
    })
  }

}

function manageRadarImages() {
  var baseDate = new Date()
  baseDate.setMinutes(baseDate.getMinutes() - 6);

  var imageDate = new Date(baseDate.valueOf() + baseDate.getTimezoneOffset() * 60000);
  imageDate.setMinutes((Math.floor(imageDate.getMinutes() / 6) * 6))
  var imageURL = imageBase + moment(imageDate).format('YYYYMMDDHHmm') + ".png"
  var imageId = moment(imageDate).format('YYYYMMDDHHmm')
  if (ImageLoop[0].id < imageId) {
    console.log("adding newer image,", imageURL)
    ImageLoop.unshift({
      id: imageId,
      url: imageURL
    })
    console.log("removing oldest image,", ImageLoop.pop().url);
  }
}




function loopRadarImages() {
  for (i = ImageLoop.length - 1; i >= 0; i--) {
    if (ImageLoop[i].url == $("#overlayLoop").attr("src")) {
      if (i == 0) {
        if (pauseLoop == true) {
          pauseLoop = false
          $("#overlayLoop").attr("src", ImageLoop[ImageLoop.length - 1].url)
          console.log("current url", $("#overlayLoop").attr("src"))
        } else {
          pauseLoop = true
          console.log("pausing for one cycle as its the last frame of the loop")
        }
      } else {
        pauseLoop = false
        $("#overlayLoop").attr("src", ImageLoop[i - 1].url)
        console.log("current url", $("#overlayLoop").attr("src"))
      }
      break
    }
  }
}
