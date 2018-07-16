var PDFDocument = require('pdfkit');
var request = require('request');

exports.finshCertificate = function(res, organiser, logo, name, eventName, raceName, date, finishTime, overall, gender, category, callback) {
  try {
    console.log('finshCertificate() called');
    var completedText = 'completed the';
    var inText = ' in '
    var mainTitle = eventName + ' - ' + raceName;
    var subTitle = date;
    var heading = 'RACE DIRECTOR';
    var subheading = 'www.racedirector.co.uk'

    var doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });
    var fs = require('fs');
    var x, y;

    doc.pipe(res);

    doc.fontSize(20).font(__dirname + '/fonts/Roboto-Black.ttf');

    var x = (doc.page.width / 2) - (doc.widthOfString(name) / 2);

    doc.fillColor('red')
      .text(name, x, 260)

    y = 300;


    doc.fontSize(14).opacity(1).fillColor('black');

    x = (doc.page.width / 2) - (doc.widthOfString(completedText) / 2);
    y += doc.heightOfString(completedText, doc.widthOfString(completedText));
    doc.text(completedText, x, y, {
      underline: false
    });

    doc.fontSize(18);
    x = (doc.page.width / 2) - (doc.widthOfString(mainTitle) / 2);
    y = 435 + doc.heightOfString(mainTitle, doc.widthOfString(mainTitle));
    doc.text(mainTitle, x, y);


    doc.moveTo(0, doc.page.height - 10)
      .quadraticCurveTo(doc.page.width, doc.page.height, doc.page.width, doc.page.height - 100)
      .lineTo(doc.page.width, doc.page.height)
      .lineTo(0, doc.page.height).fillOpacity(.7)
      .fill();

    console.log('Getting logo');

    request({
      url: logo,
      encoding: null
    }, (error, response, body) => {
      console.log('Logo response ' + error);
      if (!error && response.statusCode === 200) {

        var img = new Buffer(body, 'base64');
        doc.image(img, (doc.page.width - 150) / 2, 360, {
          width: 150,
          height: 75,
          fit: [150, 75],
          align: 'center'
        });

        doc.fontSize(14);
        x = (doc.page.width / 2) - (doc.widthOfString(inText) / 2);
        y += 25 + doc.heightOfString(inText, doc.widthOfString(inText));
        doc.text(inText, x, y);

        doc.fontSize(32);
        x = (doc.page.width / 2) - (doc.widthOfString(finishTime) / 2);
        y += 10 + doc.heightOfString(finishTime, doc.widthOfString(finishTime));
        doc.fillColor('red').text(finishTime, x, y, {
          underline: true
        });

        doc.fontSize(14).fillColor('black');
        x = (doc.page.width / 2) - (doc.widthOfString(subTitle) / 2);
        y += 50 + doc.heightOfString(subTitle, doc.widthOfString(subTitle));
        doc.text(subTitle, x, y);

        var col = doc.page.width / 3; //divide in three columns
        var colmid = col / 2;

        var genPos = 'Gender Position';
        var overPos = 'Overall Position';
        var catPos = 'Cat. Position';
        doc.fontSize(32).fillOpacity(1);
        x = (col * 1 - colmid) - (doc.widthOfString(gender) / 2);
        y = (((doc.page.height - 655) / 2) + 655) - (doc.heightOfString(gender, doc.widthOfString(gender)) / 2);
        doc.fillColor('red').text(gender, x, y);
        doc.fontSize(14).fillColor('black').text(genPos, (col * 1 - colmid) - (doc.widthOfString(genPos) / 2), y + 20 + doc.heightOfString(gender, doc.widthOfString(
          gender))).fontSize(
          32);
        x = (col * 2 - colmid) - (doc.widthOfString(overall) / 2);
        doc.fillColor('red').text(overall, x, y);
        doc.fontSize(14).fillColor('black').text(overPos, (col * 2 - colmid) - (doc.widthOfString(overPos) / 2), y + 20 + doc.heightOfString(overall, doc
            .widthOfString(
              overall)))
          .fontSize(
            32);
        x = (col * 3 - colmid) - (doc.widthOfString(category) / 2);
        doc.fillColor('red').text(category, x, y);
        doc.fontSize(14).fillColor('black').text(catPos, (col * 3 - colmid) - (doc.widthOfString(catPos) / 2), y + 20 + doc.heightOfString(category, doc.widthOfString(
            category)))
          .fontSize(
            32);

        //Background
        doc.fillOpacity(0.2).image(__dirname + '/images/background.png', 0, 300, {
          width: doc.page.width
        }).fillOpacity(1);


        doc.rect(0, 300, doc.page.width, 658).opacity(0.2).fillColor('#ada095').fill();
        doc.rect(0, 655, doc.page.width, doc.page.height).opacity(0.4).fillColor(
          '#ada095').fill();

        doc.fillColor('black');
        doc.fontSize(22);
        doc.rect(0, 0, doc.page.width, 250).clip();
        doc.fillOpacity(0.2).image(__dirname + '/images/mills.jpg', 0, 0, {
          width: doc.page.width
        }).fillOpacity(.8);


        doc.text(heading, (doc.page.width / 2) - (doc.widthOfString(heading) / 2), 50)
        doc.image(__dirname + '/images/rdlogo.png', Number((doc.page.width - 150) / 2).toFixed(0), 100, {
          width: 150
        });
        doc.fontSize(14);

        doc.fillColor('black')
          .text(subheading, (doc.page.width / 2) - (doc.widthOfString(subheading) / 2), 220);



        // end and display the document in the iframe to the right
        doc.end();

        console.log('Calling callback()');
        callback(null);
      } else {
        console.log('Calling callback() with error');
        callback({
          message: 'Invalid lgoo url',
          err: error
        });
      }
    });
  } catch (ex) {
    console.log(ex);
    callback(ex);
  }
};
