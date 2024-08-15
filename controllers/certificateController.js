const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateCertificate = (req, res) => {
    const { userName } = req.query;

    const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margin: 50,
    });

    const fileName = `${userName}_certificate.pdf`;
    const filePath = path.join(__dirname, '../certificates', fileName);

    doc.pipe(fs.createWriteStream(filePath));

    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f4f4f4');
const logoPath = path.join(__dirname, '../public/images/prompt.png');
    doc.image(logoPath, doc.page.width / 2 - 50, 50, {
        fit: [100, 100],
        align: 'center',
        valign: 'center',
    });

    doc
        .fontSize(30)
        .fillColor('#333333')
        .text('Certificate of Completion', {
            align: 'center',
        });

    doc
        .fontSize(24)
        .text(`This is to certify that`, {
            align: 'center',
        })
        .moveDown(0.5)
        .fontSize(28)
        .font('Helvetica-Bold')
        .text(userName, {
            align: 'center',
        })
        .fontSize(24)
        .text(`has successfully completed the`, {
            align: 'center',
        })
        .moveDown(0.5)
        .fontSize(26)
        .font('Helvetica-Bold')
        .text('Prompt Engineering Course', {
            align: 'center',
        })
        .moveDown(1);

    doc
        .fontSize(20)
        .font('Helvetica')
        .text(`Date: ${new Date().toLocaleDateString()}`, {
            align: 'center',
        })
        .moveDown(0.5)
        .text('Issued by XYZ Academy', {
            align: 'center',
        });

    doc
        .image('path/to/signature1.png', doc.page.width / 4 - 50, doc.page.height - 150, {
            fit: [100, 50],
            align: 'left',
        })
        .image('path/to/signature2.png', (3 * doc.page.width) / 4 - 50, doc.page.height - 150, {
            fit: [100, 50],
            align: 'right',
        });

    doc
        .moveTo(doc.page.width / 4 - 75, doc.page.height - 100)
        .lineTo(doc.page.width / 4 + 75, doc.page.height - 100)
        .stroke();

    doc
        .moveTo((3 * doc.page.width) / 4 - 75, doc.page.height - 100)
        .lineTo((3 * doc.page.width) / 4 + 75, doc.page.height - 100)
        .stroke();

    doc
        .fontSize(16)
        .text('Signature 1', doc.page.width / 4 - 50, doc.page.height - 90, {
            align: 'center',
        })
        .text('Signature 2', (3 * doc.page.width) / 4 - 50, doc.page.height - 90, {
            align: 'center',
        });

    doc.end();

    doc.on('finish', () => {
        res.download(filePath, `${userName}_certificate.pdf`, (err) => {
            if (err) {
                console.error('Error downloading certificate:', err);
                res.status(500).send('Error generating certificate');
            }
        });
    });

    console.log(`Certificate generated: ${fileName}`);
};
