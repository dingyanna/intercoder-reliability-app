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
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import styles from './Home.css';
import {PythonShell} from 'python-shell';
import Swal from 'sweetalert2';

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

function createData(category: string, weight: number) {
  return { category, weight };
}

const rows = [
  createData('strongly disagree', 0),
  createData('disagree', 1),
  createData('neutral', 2),
  createData('agree', 3),
  createData('strongly agree', 4),
];

export default function Calculation(): JSX.Element {
  const [data, setData] = React.useState('no file chosen');
  const [dataPath, setDataPath] = React.useState('');
  const [categories, setCategories] = React.useState('no file chosen');
  const [weights, setWeights] = React.useState('no file chosen');
  const [measure, setMeasure] = React.useState('none');
  const [level_of_measurement, setLevel] = React.useState('nominal');
  const [result, setResult] = React.useState('');
  const [numCoders, setNumCoders] = React.useState('-');
  const [numSubjects, setNumSubjects] = React.useState('-');
  const [categoryList, setCategoryList] = React.useState('');

  const onDataUploaded = (e: any): void => {
    e.preventDefault();
    setData(e.target.files[0].name);
    setDataPath(e.target.files[0].path);
    const path = require('path');
    const options = {
      scriptPath: path.join(__dirname, '/../engine'),
      args: [e.target.files[0].path]
    }
    const detect_data = new PythonShell('detect_data.py', options);

    detect_data.on('message', function(message) {
      console.log(message)
      const splitted = message.split(" "); 
      setNumCoders(splitted[0]);
      setNumSubjects(splitted[1]);
    })
    
  };

  const onCategoriesUploaded = (e: any): void => {
    e.preventDefault();
    setCategories(e.target.files[0].name);
    const path = require('path');
    const options = {
      scriptPath: path.join(__dirname, '/../engine'),
      args: [e.target.files[0].path]
    }
    const detect_cat = new PythonShell('detect_category.py', options);

    detect_cat.on('message', function(message) {
      console.log(message);
      setCategoryList(message);
    })
  };

  const onWeightsUploaded = (e: any): void => {
    e.preventDefault();
    setWeights(e.target.files[0].name);
  };

  const onMeasureSet = (e: any): void => {
    e.preventDefault();
    setMeasure(e.target.value);
  };

  const onReset = (e: any): void => {
    e.preventDefault();
    setData('no file chosen');
    setCategories('no file chosen');
    setWeights('no file chosen');
    setNumCoders(0);
    setNumSubjects(0);
  };

  const onLevelSet = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLevel((e.target as HTMLInputElement).value);
  };

  const checkWeighted = (): boolean => {
    if (measure === 'Weighted Kappa') {
      return true;
    }
    if (
      [
        "Fleiss' Kappa",
        "Krippendorff's Alpha",
        'Percentage Agreement',
      ].includes(measure)
    ) {
      if (level_of_measurement == 'ordinal') {
        return true;
      }
      return false;
    }
    return false;
  };

  const calculate = () => {
    const path = require('path');
    const options = {
      scriptPath: path.join(__dirname, '/../engine'),
      args: [dataPath]
    }
    const cohen_kappa = new PythonShell('cohen_kappa.py', options);

    cohen_kappa.on('message', function(message) {
      console.log(message)
      setResult(message);
      Swal.fire( {
        title: "Result", 
        text: message,
        confirmButtonColor: "#7986cb",   
        confirmButtonText: "OK",
      } )
    })
  }

  return (
    <ThemeProvider theme={theme1}>
      <Grid container style={{ marginLeft: 30 }} spacing={3}
      >
        <Grid
          item
          container
          xs={3}
          direction="column"
          spacing={3}
        >
          <Grid item style={{ marginBottom: 10 }}>
            <Typography variant="h6" style={{ color: 'gray' }}>
              SETTINGS
            </Typography>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" style={{ width: 180 }}>
              <InputLabel htmlFor="outlined-age-native-simple">
                Measure
              </InputLabel>
              <Select
                native
                label="measure"
                inputProps={{
                  name: 'measure',
                  id: 'outlined-age-native-simple',
                }}
                onChange={onMeasureSet}
              >
                <option aria-label="None" value="" />
                <option value={"Cohen's Kappa"}>Cohen's Kappa</option>
                <option value="Weighted Kappa">Weighted Kappa</option>
                <option value={"Krippendorff's Alpha"}>
                  Krippendorff's Alpha
                </option>
                <option value="Percentage Agreement">
                  Percentage Agreement
                </option>
                <option value={"Scott's Pi"}>Scott's Pi</option>
                <option value={"Fleiss' Kappa"}>Fleiss' Kappa</option>
              </Select>
            </FormControl>
          </Grid>
          {[
            "Krippendorff's Alpha",
            "Fleiss' Kappa",
            'Percentage Agreement',
          ].includes(measure) && (
              <Grid item>
                <Typography variant="subtitle1">Level of Measurement:</Typography>
                <RadioGroup
                  aria-label="level_of_measurement"
                  name="level_of_measurement"
                  value={level_of_measurement}
                  onChange={onLevelSet}
                  row
                >
                  <FormControlLabel
                    value="nominal"
                    control={<Radio color="default" />}
                    label="nominal"
                  />
                  <FormControlLabel
                    value="ordinal"
                    control={<Radio color="default" />}
                    label="ordinal"
                  />
                </RadioGroup>
              </Grid>
            )}
          <Grid item>
            <input
              type="file"
              name="data"
              id="data"
              className={styles.inputfile}
              onChange={onDataUploaded}
            />
            <label
              htmlFor="data" style={{ padding: 7 }}>
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
          {checkWeighted() && (
            <Grid item>
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
          )}
          <Grid item>
            <Button
              variant="contained"
              style={{ width: 180, backgroundColor: '#9fa8da' }}
              onClick={onReset}
            >
              Reset Files
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{ width: 180, backgroundColor: '#7986cb' }}
              onClick={calculate}
            >
              OK
            </Button>
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={9}
          direction="column"
          justify="flex-start"
          spacing={3}
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

          <Grid item style={{ maxHeight: 500, overflow: 'auto' }}>
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
              {categoryList}
            </Grid>
            <div style={{ height: 300 }} />
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
