const fs = require('fs');
const d = require('./dataUtil.js');

const PRODUCTS = 'products';
const ARTICLES = 'articles';
const USERS = 'users';
const STYLES = 'styles'; 
const PAGES = 'pages';
const SAVED = 'saved';

const checkIfFileExists = async file => new Promise(resolve => fs.stat(file, (err, stat) => resolve(!err)));

const fileNullCheck = file => (!file || file===undefined || file.length==0 || file=='{}');

const readDataFromFile = async (file,isJson=true) => new Promise(resolve => { 
  let fileData = null;
  fs.readFile(file, 'utf8', (err, fileString) => {
    if (!err && !fileNullCheck(fileString)) 
      fileData = isJson ? JSON.parse(fileString) : fileString;
    resolve(fileData);
  });
});

const writeDataToFile = async (file,data) => new Promise(resolve => 
  fs.writeFile(file, JSON.stringify(data), err => resolve(data)));

const getFileData = async (file,isJson=true) => new Promise (resolve => {
  checkIfFileExists(file).then(result =>
    readDataFromFile(file,isJson).then(fileData => 
      resolve(fileData)
    )
  )
});  

const generateData = type => {
  if(type===PRODUCTS) return d.generateProductData();
  if(type===ARTICLES) return d.generateArticleData();
  if(type===STYLES) return d.generateStyleData();
  if(type===SAVED) return d.generateSavedData(); 
  if(type===USERS) return d.generateUserData();
  if(type===PAGES) return d.generatePageData(); 
  return null;
};

const getData = async type => new Promise (resolve => {
  let file = './server/data/'+type+'.json';
  getFileData(file).then(fileData=>{
    if(!fileData) {
      fileData = generateData(type);
      writeDataToFile(file,fileData);
    }
    resolve(fileData);
  });
});

const sendData = (res,data) => res.json({message:data});

// start serverUtil class definition

let serverUtil = class {
  sendProductData = (req,res) => getData(PRODUCTS).then(data => sendData(res,data));
  sendArticleData = (req,res) => getData(ARTICLES).then(data => sendData(res,data));
  sendStyleData = (req,res) => getData(STYLES).then(data => sendData(res,data));
  sendSavedData = (req,res) => getData(SAVED).then(data => sendData(res,data));
  sendPageData = (req,res) => getData(PAGES).then(data => sendData(res,data));
  sendUserData = (req,res) => getData(USERS).then(data => sendData(res,data));
}

module.exports = new serverUtil();

/*
  serverUtil.js is a helper class for the api routing in index.js

  It allows api calls to be one liners that call serverutils

  serverUtils is responsible for:
    accessing and retrieving data from requests, files, and urls
    sending data to the client

  serverUtils is not responsible for:
    processing / parsing data
    generating new data in charts
*/

// end serverUtil class definition