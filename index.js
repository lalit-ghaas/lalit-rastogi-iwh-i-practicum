const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-na1-73f95f6e-e095-430b-9ea1-2576da29dc57';
const customObjectName = 'students';
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {
  try {
    const customObjectsEndpoint = `https://api.hubapi.com/crm/v3/objects/${customObjectName}`;
    
    const response = await axios.get(customObjectsEndpoint, {
      headers: {
        'Authorization': `Bearer ${PRIVATE_APP_ACCESS}`,
         'Content-Type': 'application/json'
      },
      params: {
        properties: 'name,father_name,address', 
      },
    });

     const customObjects = response.data.results.map(customObject => {
      return {
        name: customObject.properties.name,
        father_name: customObject.properties.father_name,
        address: customObject.properties.address,
      };
    });
    
    // Render the homepage.pug template with the customObjects data
    const pageTitle = "Homepage | Integrating With HubSpot I Practicum";
    res.render('homepage', { pageTitle, customObjects });
  } catch (error) {
    console.error('Error fetching custom objects:', error);
    res.status(500).send('Error fetching custom objects');
  }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
  const pageTitle = "Update Custom Object Form | Integrating With HubSpot I Practicum";
  res.render('updates', { pageTitle });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
  try {
    const { name, father_name, address } = req.body;

    // Make a POST request to create a new custom object record
    const customObjectsEndpoint = `https://api.hubapi.com/crm/v3/objects/${customObjectName}`;
    const response = await axios.post(customObjectsEndpoint, {
      properties: {
        name,
        father_name,
        address,
      },
    }, {
      headers: {
        'Authorization': `Bearer ${PRIVATE_APP_ACCESS}`,
      },
    });

    console.log('New custom object record created:', response.data);

    // Redirect back to the homepage after successful creation
    res.redirect('/');
  } catch (error) {
    console.error('Error creating new custom object record:', error);
    res.status(500).send('Error creating new custom object record');
  }
});
/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));