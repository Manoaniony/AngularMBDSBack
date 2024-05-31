const cloudinary = require('cloudinary')
const dotenv = require('dotenv')
dotenv.config();

cloudinary.config({
  cloud_name: 'manolotsoo-cloud',
  api_key: '221819711568616',
  api_secret: 'Xm7-nFFagvcUHb_I_JZ5AEhpPxE'
})

exports.uploads = (file, folder) => {
  return new Promise(resolve => {
    cloudinary.uploader.upload(file, (result) => {
      resolve({
        url: result.url,
        id: result.public_id
      })
    }, {
      resource_type: "auto",
      folder: folder
    })
  })
}