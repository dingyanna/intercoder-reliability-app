import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';

import {
  InputLabel,
  FormControl,
  Select,
  Grid,
  Button,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  ThemeProvider,
  Divider,
} from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';
import styles from './Home.css';
import { PythonShell } from 'python-shell';
import Swal from 'sweetalert2';
import { Alert, AlertTitle } from '@material-ui/lab';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';


const theme1 = createMuiTheme({
  palette: {
    primary: {
      main: '#7986cb',
    },
    secondary: {
      main: '#9fa8da',
    },
  },
});

export default function Calculation(): JSX.Element {
  const [data, setData] = React.useState('no file chosen');
  const [dataPath, setDataPath] = React.useState('');

  const [categories, setCategories] = React.useState('no file chosen');
  const [catPath, setCatPath] = React.useState('');

  const [weights, setWeights] = React.useState('no file chosen');
  const [weightsPath, setWeightsPath] = React.useState('');

  const [result, setResult] = React.useState('');
  const [numCoders, setNumCoders] = React.useState('None');
  const [numSubjects, setNumSubjects] = React.useState('None');

  const [categoryList, setCategoryList] = React.useState(['None']);
  const [weightsList, setWeightsList] = React.useState(['None']);
  const [linearProgress, setLinearProgress] = React.useState(false);

  const [backDrop, setBackDrop] = React.useState(false);

  const [openResult, setOpenResult] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const [woWeights, setWoWeights] = React.useState(false);
  const [wWeights, setWWeights] = React.useState(false);

  const [inputExistence, setInputExistence] = React.useState("")


  const [state, setState] = React.useState({
    cohen: false,
    weighted: false,
    multilabel: false,
    kNominal: false,
    kOrdinal: false,
    pNominal: false,
    pOrdinal: false,
    fNominal: false,
    fOrdinal: false,
    sNominal: false,
    sOrdinal: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (["cohen", "sNominal", "kNominal",
      "fNominal", "pNominal", "multilabel"].includes(event.target.name)) {
      if (woWeights) {
        setWoWeights(false)
      }
    }
    if (["weithed", "fOrdinal", "kOrdinal",
      "pOrdinal", "sOrdinal"].includes(event.target.name)) {
      if (wWeights) {
        setWWeights(false)
      }
    }
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const { cohen, weighted, multilabel, kNominal, kOrdinal,
    pNominal, pOrdinal, fNominal, fOrdinal, sNominal, sOrdinal, } = state;


  const onDataUploaded = (e: any): void => {

    setLinearProgress(false)
    setData(e.target.files[0].name);
    if (e.target.files !== undefined) {
      setLinearProgress(true)
    }
    setDataPath(e.target.files[0].path);
    const path = require('path');
    const options = {
      scriptPath: path.join(__dirname, '/../engine'),
      args: [e.target.files[0].path]
    }
    const detect_data = new PythonShell('detect_data.py', options);
    detect_data.on('message', function (message) {
      console.log(message)
      const splitted = message.split(" ");
      setNumCoders(splitted[0]);
      setNumSubjects(splitted[1]);
      setLinearProgress(false)
    })

  };

  const onCategoriesUploaded = (e: any): void => {

    setLinearProgress(false)
    if (e.target.files !== undefined) {
      setLinearProgress(true)
    }
    setCategories(e.target.files[0].name);
    setCatPath(e.target.files[0].path)
    const path = require('path');
    const options = {
      scriptPath: path.join(__dirname, '/../engine'),
      args: [e.target.files[0].path]
    }
    const detect_cat = new PythonShell('detect_category.py', options);

    detect_cat.on('message', function (message) {
      console.log(message);
      const mylist = message.split(',');
      setCategoryList(mylist);
      setLinearProgress(false)
    })
  };

  const onWeightsUploaded = (e: any): void => {
    setLinearProgress(false)
    if (e.target.files !== undefined) {
      setLinearProgress(true)
    }
    setWeights(e.target.files[0].name);
    setWeightsPath(e.target.files[0].path)
    const path = require('path');
    const options = {
      scriptPath: path.join(__dirname, '/../engine'),
      args: [e.target.files[0].path]
    }
    const detect_weight = new PythonShell('detect_weight.py', options);

    detect_weight.on('message', function (message) {
      console.log(message);
      let tokenize1 = message.split(',')
      setWeightsList(tokenize1)
      setLinearProgress(false);
    })

  };


  const onReset = (e: any): void => {
    setData('no file chosen');
    setCategories('no file chosen');
    setWeights('no file chosen');
    setNumCoders('None');
    setNumSubjects('None');
    setCategoryList(['None']);
    setWeightsList(['None']);
    setLinearProgress(false);
    setResult('');
    setOpenResult(false);
    setOpenError(false);
    setState({
      cohen: false,
      weighted: false,
      multilabel: false,
      kNominal: false,
      kOrdinal: false,
      pNominal: false,
      pOrdinal: false,
      fNominal: false,
      fOrdinal: false,
      sNominal: false,
      sOrdinal: false,
    });
    setWoWeights(false);
    setWWeights(false);
  };

  const checkWeighted = (): boolean => {

    if (wWeights || weighted || fOrdinal || pOrdinal || kOrdinal || sOrdinal) {
      return true;
    }
    return false;

  };

  const checkInput = () => {
    let inputError = [];

    let valueArray = Object.values(state);
    if (!valueArray.includes(true)) {
      inputError.push("measure")
    }

    if (data === 'no file chosen') {
      inputError.push("data");
    }
    if (categories === 'no file chosen') {
      inputError.push("categories");
    }

    if (checkWeighted() && weights === 'no file chosen') {
      inputError.push(" weights");
    }
    let msg = inputError.join(', ');
    let result1 = "Missing input(s): ".concat(msg)
    setInputExistence(result1);
    if (inputError.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  const calculate = () => {
    if (!checkInput()) {
      setOpenError(true);
      return;
    }
    setBackDrop(true);

    let values = [cohen, weighted, multilabel, pNominal, pOrdinal,
      kNominal, kOrdinal, sNominal, sOrdinal, fNominal, fOrdinal];
    let measureBitMap = ""
    for (let i = 0; i < values.length; i++) {
      if (values[i]) {
        measureBitMap = measureBitMap.concat("1")
      } else {
        measureBitMap = measureBitMap.concat("0")
      }
    }

    const path = require('path');
    const options = {
      scriptPath: path.join(__dirname, '/../engine'),
      args: [measureBitMap, dataPath, catPath, weightsPath]
    }

    let python_program = new PythonShell('cal_multiple.py', options);
    python_program.on('message', function (message) {
      console.log(message)
      // check error

      let msg = message.split(", ").join("\n");
      console.log(msg)
      setResult(msg);
      setOpenResult(true);
      setBackDrop(false);
      setOpenError(false);
    })
  }



  return (
    <ThemeProvider theme={theme1}>
      <Backdrop open={backDrop}>
        <CircularProgress />
      </Backdrop>
      <Grid container style={{ overflow: 'auto', height: 800, }}
      >
        <Grid
          item
          container
          xs={5}
          direction="column"
          spacing={2}
        >

          <Grid item style={{ marginBottom: 10 }}>
            <Typography variant="h6" style={{ color: 'gray' }}>
              SETTINGS
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              Choose measure(s)
            </Typography>
          </Grid>
          <Grid item container>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" >
                <FormLabel component="legend">Without weights</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={cohen} onChange={handleChange} name="cohen" />}
                    label="Cohen's Kappa"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={pNominal} onChange={handleChange} name="pNominal" />}
                    label="Percentage Agreement"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={kNominal} onChange={handleChange} name="kNominal" />}
                    label="Krippendorff's Alpha"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={sNominal} onChange={handleChange} name="sNominal" />}
                    label="Scott's Pi"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={fNominal} onChange={handleChange} name="fNominal" />}
                    label="Fleiss' Kappa"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={woWeights}
                      onChange={() => {
                        if (!woWeights) {
                          setState({
                            ...state, cohen: true, multilabel: true,
                            fNominal: true, pNominal: true,
                            kNominal: true, sNominal: true
                          })
                        }
                        setWoWeights(!woWeights);
                      }}
                      name="woWeights" />}
                    label="all above"
                  />
                </FormGroup>
              </FormControl>
              <FormControl component="fieldset" >
                <FormLabel component="legend">Multi-label</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={multilabel} onChange={handleChange} name="multilabel" />}
                    label="Multi-label Kappa"
                  />
                 
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} item>
              <FormControl component="fieldset" >
                <FormLabel component="legend">With weights</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={weighted} onChange={handleChange} name="weighted" />}
                    label="Weighted Kappa"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={pOrdinal} onChange={handleChange} name="pOrdinal" />}
                    label="Weighted Percentage Agreement"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={kOrdinal} onChange={handleChange} name="kOrdinal" />}
                    label="Krippendorff's Alpha"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={sOrdinal} onChange={handleChange} name="sOrdinal" />}
                    label="Scott's Pi"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={fOrdinal} onChange={handleChange} name="fOrdinal" />}
                    label="Fleiss' Kappa"
                  />

                </FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={wWeights}
                    onChange={() => {
                      if (!wWeights) {
                        setState({
                          ...state, weighted: true, fOrdinal: true,
                          pOrdinal: true, kOrdinal: true, sOrdinal: true
                        })
                      }
                      setWWeights(!wWeights);
                    }}
                    name="wWeights" />}
                  label="all above"
                />
                
              </FormControl>
              
            </Grid>
          </Grid>


          <div style={{ height: 30 }}> </div>


          <Grid container item spacing={5}>
            <Grid container item xs={12} sm={6} spacing={2}>
              <Grid item>
                <input
                  type="file"
                  name="data"
                  id="data"
                  className={styles.inputfile}
                  onChange={onDataUploaded}
                />
                <label
                  htmlFor="data" style={{ padding: 7, }}>
                  Upload Data
            </label>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: 'gray',
                    maxWidth: 180,
                    maxHeight: 30,
                    overflow: 'auto',
                  }}
                >
                  {data}
                </Typography>
              </Grid>
              <Grid item>
                <input
                  type="file"
                  name="categories"
                  id="categories"
                  className={styles.inputfile}
                  onChange={onCategoriesUploaded}
                />
                <label
                  htmlFor="categories"
                  style={{ padding: 7, backgroundColor: 'light' }}
                >
                  Upload Categories
                </label>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: 'gray',
                    maxWidth: 180,
                    maxHeight: 30,
                    overflow: 'auto',
                  }}
                >
                  {categories}
                </Typography>
              </Grid>
            </Grid>
            {checkWeighted() && (
              <Grid item xs={12} sm={6}>
                <input
                  type="file"
                  name="weights"
                  id="weights"
                  className={styles.inputfile}
                  onChange={onWeightsUploaded}
                />
                <label htmlFor="weights" style={{ padding: 7 }}
                >
                  Upload Weights
              </label>
                <Grid item>
                  <Typography
                    variant="subtitle1"
                    noWrap
                    style={{
                      color: 'gray',
                      maxWidth: 180,
                      maxHeight: 30,
                      overflow: 'auto',
                    }}
                  >
                    {weights}
                  </Typography>
                </Grid>
              </Grid>
            )
            }

          </Grid>

          <Grid item container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                style={{ width: 180, backgroundColor: '#7986cb', }}
                onClick={onReset}
              >
                reset
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                style={{ width: 180, backgroundColor: '#7986cb', }}
                onClick={calculate}
              >
                calculate
              </Button>
            </Grid>
          </Grid>
          <div style={{ height: 180 }}> </div>
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid
          item
          container
          xs={7}
          direction="column"
          justify="flex-start"
          spacing={3}
          style={{ marginLeft: 15 }}
        >
          <Grid item style={{ marginBottom: 10 }}>
            <Typography variant="h6" style={{ color: 'gray' }}>
              INFORMATION
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="subtitle1" style={{ color: 'gray' }}>
              This section displays the essential information extracted from the
              files uploaded in SETTINGS. Please confirm it before pressing OK.
              It is recommended to refer the documentation for requirements on
              the file format.
            </Typography>
          </Grid>
          {linearProgress && <LinearProgress></LinearProgress>}
          <Grid item style={{ maxHeight: 500, overflow: 'auto', marginTop: 15 }}>
            <Grid item style={{ marginBottom: 10 }}>
              <Collapse in={openResult}>
                <Alert
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenResult(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  <AlertTitle>Result</AlertTitle>
                  <Typography
                    variant="subtitle1"
                    className={styles.new_line}
                  >{result}</Typography>
                </Alert>
              </Collapse>
            </Grid>

            <Grid item style={{ marginBottom: 10 }}>
              <Collapse in={openError}>
                <Alert
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenError(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  <AlertTitle>Error</AlertTitle>
                  <Typography
                    variant="subtitle1"
                    className={styles.new_line}
                    style={{ marginLeft: 20 }}>{inputExistence}</Typography>
                </Alert>
              </Collapse>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">
                1. Number of Coders: {numCoders}
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant="subtitle1">
                2. Number of Subjects: {numSubjects}
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant="subtitle1">3. Categories:</Typography>
              <Typography
                variant="subtitle1"
                className={styles.new_line}
                style={{ marginLeft: 20 }}>{categoryList.join('\n')}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">4. Category to Weight:</Typography>
              <Typography
                variant="subtitle1"
                className={styles.new_line}
                style={{ marginLeft: 20 }}>{weightsList.join('\n')}</Typography>
            </Grid>
          </Grid>
          <div style={{ height: 180 }}> </div>
        </Grid>

      </Grid>

    </ThemeProvider >
  );
}
