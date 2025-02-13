const express = require("express");
const multer = require("multer");
const cors = require("cors");
const uuid = require("uuid").v4;

const app = express();
cors(app);

//uploading a single file
// app.post("/upload", upload.single("file"), (req, res, next) => {
//   res.json({
//     status: "success",
//   });
// });

// const mutliUpload = upload.fields([
//   {
//     name: "file",
//     maxCount: 1,
//   },
//   {
//     name: "photo",
//     maxCount: 1,
//   },
// ]);

//using multi filed uplod
// app.post("/upload", mutliUpload, (req, res, next) => {
//   //every this files is under req.file
//   console.log(req.files);
//   res.json({
//     status: "success",
//   });
// });

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${uuid()}-${originalname}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000000, files: 3 },
});

//uploading multiple files
app.post("/upload", upload.array("file"), (req, res, next) => {
  res.json({
    status: "success",
  });
});

//better error handling
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File is too large",
      });
    }

    if (error.code === "LIMIT_FIELD_COUNT") {
      return res.status(400).json({
        message: "File count limit reached",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "Send the appropriate file type.",
      });
    }
  }
});

const port = 7000;

app.listen(port, () => {
  console.log(`App is listening on ${port}!`);
});
