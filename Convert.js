
const axios = require('axios');
// [[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]] Get Access Token From Refresh Token

// var id_data ="";

const FormData = require('form-data');
const json = require('formidable/src/plugins/json');
let data = new FormData();
data.append('client_id', '1000.CE8QAHXO98IZN5HWJ7MPQ6N8CF8LGD');
data.append('client_secret', 'f9e3dce07a66dab577fe1583866a6cc5069dbecb4c');
data.append('refresh_token', '1000.d3ea5019aa9f88b24fa18b881806ca96.c48baae0ea057f4c04e66ce9068784d4');
data.append('grant_type', 'refresh_token');

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://accounts.zoho.com/oauth/v2/token',
  headers: { 
      ...data.getHeaders()
  },
  data : data
};

axios.request(config)
.then((response) => {
    var token = response.data.access_token;
    global.apiResponse = token;
  console.log(JSON.stringify(response.data));

  getrecord(token);
})
.catch((error) => {
  console.log(error);
});


//
// Get record by Id Zoho CRM
function getrecord(access_token){
    console.log("function getrecords",access_token);
    const axios = require('axios');
// let data2 = '';

let config2 = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://crm.zoho.com/crm/v2/API_Layer/5291167000004276006',
  headers: { 
    'Authorization': 'Zoho-oauthtoken '+access_token,
  },
  data : ''
};

axios.request(config2)
.then((response) => {
//     var getrecorddata = JSON.stringify(response.data.data[0]);
//   console.log("Getrecordbyid",getrecorddata);
  record_id = JSON.stringify(response.data.data[0].id);
  console.log("record id == "+record_id);
  record_From = JSON.stringify(response.data.data[0].From);
  console.log("record INR amount == "+record_From);
  record_To = JSON.stringify(response.data.data[0].To);
  console.log("record usd == "+record_To);
  record_INR = JSON.stringify(response.data.data[0].INR);
  console.log("record INR  == "+record_INR);
//   record_CNY = JSON.stringify(response.data.data[0].CNY);
//   console.log("record cny == "+record_CNY);
//   record_YUAN = JSON.stringify(response.data.data[0].YUAN);
//   console.log("record yuan == "+record_YUAN);
  let recordObj = {
    'record_id': record_id,
    'from': record_From,
    'to':record_To,
    'amount':record_INR
    // 'record_CNY':record_CNY,
    // 'record_YUAN':record_YUAN
  }


  getcurrency(recordObj)

})
.catch((error) => {
  console.log(error);
});
}

// End of Get record by id
// [[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]] Currency Exchange API for convert currencies
function getcurrency(rec){
  var record_idd = record_id;
    console.log("record object pass",rec);
var rec_From = rec.from.slice(1);
var rec_to =rec.to.slice(1);
var removelast_from = rec_From.slice(0, rec_From.length - 1);
var remove_last_to = rec_to.slice(0, rec_to.length - 1);
var rec_amount =rec.amount;
console.log(record_idd,removelast_from,rec_amount,remove_last_to);

    let config3 = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://api.apilayer.com/exchangerates_data/convert?to="+remove_last_to+"&from="+removelast_from+"&amount="+rec_amount,
        headers: { 
          'apikey': 'CIIlz5eAf4KJH2bVjXI1dgTjU8uQieqI'
        }
      };
      
      axios.request(config3)
      .then((response) => {
      
        var data = response.data;
        result = data.result;
        console.log("success record == ",result);
        insertrecords(result,record_idd);
      })
      .catch((error) => {
        console.log(error);
      });

}
function insertrecords(...datamap){
  var record_idds = datamap[1];

  //
  // const str2 = '3.14';

  //
  var record_id_last= record_idds.replace(/"/g, '');
  var resultdatas =datamap[0];

  console.log(resultdatas,record_id_last);
  
const responsesss = global.apiResponse;
console.log("Global variable",responsesss);

 
const axios = require('axios');
let data = JSON.stringify({
  "data": [
    {
      "Converted_Value": resultdatas
    }
  ]
});

let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url: 'https://crm.zoho.com/crm/v2/API_Layer/'+record_id_last,
  headers: { 
    'Authorization': "Zoho-oauthtoken "+responsesss, 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  var  APIResponsedata =JSON.stringify(response.data);
  console.log(APIResponsedata);
})
.catch((error) => {
  console.log(error);
});

  console.log("data map data == ",datamap);

}


