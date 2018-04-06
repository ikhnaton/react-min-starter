const cloudant = require('@cloudant/cloudant');
const router = require('express').Router();
const vcap = (process.env.VCAP_SERVICES != null)? JSON.parse(process.env.VCAP_SERVICES) : require('./vcap.local');

const dbname = 'todo';

const cloudantOptions = {
    url: vcap.cloudantNoSQLDB[0].credentials.url,
    plugins: [
        'promises',
        'cookieauth',
        {
            retry: {
                retryErrors: false,
                retryStatusCodes: [ 429 ],
                retryInitialDelayMsecs: 500,
                 retryDelayMultiplier: 2
            }
        }
    ]

};
let db = null;

let instance = new cloudant(cloudantOptions, (err, success) => {
	if (err != null)
	{
		console.log(err);
	}
});

instance.db.create(dbname)
.then(success => { db = instance.db.use(dbname); })
.catch(err =>
{
	if (err.statusCode === 412)
	{
		db = instance.db.use(dbname);
	}
	else
	{
		next(err);
	}
});

router.post('/insert', (req, res, next) => {
    const doc = req.body;
    db.insert(doc)
    .then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send(err);
    });
})

router.get('/getAll', (req, res, next) => {
    db.list({include_docs:true})
    .then(result => {
        res.send(result.rows.map(row => row.doc));
    }).catch(err => {
        res.status(500).send(err);
    });
})

router.get('/delete/:id/:rev', (req, res, next) => {
    const docId = req.params.id;
	const rev = req.params.rev;
    db.destroy(docId, rev)
    .then(result => {
		res.send(result);
    }).catch(err => {
        res.status(500).send(err);
    });
})


module.exports = router;
