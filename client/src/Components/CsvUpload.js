import React, { useState } from "react";
import { usePapaParse } from "react-papaparse";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import "./CsvUpload.css";

function CsvUpload(props) {
  const { readString } = usePapaParse();
  const [data, setData] = useState(null);
  const [fileName, setFile] = useState("");

  const handleUpload = () => {
    axios
      .post("/api/upload", {
        data: data,
      })
      .then((res) => {
        console.log(res);
        props.onRefresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReset = () => {
    axios
      .post("/api/reset")
      .then((res) => {
        console.log(res);
        props.onReset();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCSVRead = (data) => {
    const file = data.target.files[0];
    console.log(fileName);
    setFile(file.name);
    readString(file, {
      header: true,
      worker: true,
      complete: (results) => {
        setData(results.data);
        console.log("---------------------------");
        console.log(results);
        console.log("---------------------------");
      },
    });
  };
  return (
    <>
      <div className="CSV uploader">
        <input
          id="file-upload"
          name="fileUpload"
          type="file"
          accept=".csv"
          onChange={handleCSVRead}
        ></input>
        <label htmlFor="file-upload" id="file-drag">
          <div id="start">
            <FontAwesomeIcon
              icon={faDownload}
              size="3x"
              className="fa fa-download"
            />
            <div>Select a file or drag here</div>
          </div>
          <span id="file-upload-btn" class="btn btn-primary">
            Select a file
          </span>
        </label>
        <br />
      </div>
      <div className="fileName">
        {fileName.length > 0 ? <p>Selected File: {fileName}</p> : <p>No File Selected</p>}
      </div>
      <div className="buttons">
        <Stack spacing={2} direction="row">
          <Button variant="contained" color="info" onClick={handleUpload}>
            Upload
          </Button>
          <Button variant="outlined" color="primary" onClick={handleReset}>
            Reset Data
          </Button>
        </Stack>
      </div>
    </>
  );
}

export default CsvUpload;
