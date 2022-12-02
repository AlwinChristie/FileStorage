const express = require('express');
const router = express.Router();

// import File model
const File = require('../models/file');

const passport = require('passport');

const globals = require('./globalFunction');

// GET: /file => show list of employers
router.get('/', globals.isAuthenticated, (req, res) => {
    // query the model to fetch and pass the employer data to the view
    File.find((err, files) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('files/index', 
            { title: 'Your Files',
             files: files,
             user: req.user
            });
        }
    })  
});

// CREATE

// GET: /files/add => shows form to upload file
router.get('/add', globals.isAuthenticated, (req, res) => {
    res.render('files/add', { 
        title: 'Upload File',
        user: req.user
    });
});

// POST: /files/add => process form submission
router.post('/add', globals.isAuthenticated,(req, res) => {
    File.create(req.body, (err, newFile) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/files');
        }
    });
});

// DELETE

// GET: /files/delete => remove selected file
router.get('/delete/:_id', globals.isAuthenticated, (req, res) => {
    File.remove({ _id: req.params._id }, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/files');
        }
    })
});

// EDIT

// GET: /files/edit => display form for editing

router.get('/edit/:_id', globals.isAuthenticated, (req, res) => {
    // fetch selected file for display
    File.findById(req.params._id, (err, file) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('files/edit', { 
                title: 'Edit File',
                file: file,
                user: req.user
            });
        }
    })     
});

//POST: /employers/edit => update the db for the selected file
router.post('/edit/:_id', globals.isAuthenticated, (req, res) => {
    File.findByIdAndUpdate({ _id: req.params._id },req.body,null, (err, file) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/files')
        }
    })
})


//make public
module.exports = router;