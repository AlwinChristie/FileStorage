const express = require('express');
const router = express.Router();

// import File model
const File = require('../models/file');

const passport = require('passport');
// for handling files
const fs = require('fs');

const globals = require('./globalFunction');
const user = require('../models/user');

// GET: /file => show list of files
router.get('/', globals.isAuthenticated, (req, res) => {
    File.find( {username:req.user.username} , (err, files) => {
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

    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }

    // Adding file
    const file = req.files.file;
    const directory = __dirname
    const trimed = directory.substring(0,directory.length - 12)
    const path = trimed + "/uploads/"+ req.user.username + "/" + file.name;
    file.mv(path, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
    });

    File.create( {filename:req.body.filename, description:req.body.description, username:req.body.username, file:file.name}, (err, newFile) => {
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
    
    File.findById(req.params._id, (err, deleteFile) => {
        if (err) {
            console.log(err);
        }
        else {
            // Deleting the file
            const directory = __dirname
            const trimed = directory.substring(0,directory.length - 12)
            const path = trimed + "/uploads/"+ req.user.username + "/" + deleteFile.file;
            fs.unlink(path, function(err) {
                if (err) {
                  throw err
                } else {
                  console.log("Successfully deleted the file.")
                }
            });
            File.remove({ _id: req.params._id }, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect('/files');
                }
            })
        }
    })     
});

// DOWNLOAD
router.get('/download/:_id', globals.isAuthenticated, (req, res) => {
    // fetch selected file for display
    File.findById(req.params._id, (err, downloadFile) => {
        if (err) {
            console.log(err);
        }
        else {
            const directory = __dirname
            const trimed = directory.substring(0,directory.length - 12)
            const path = trimed + "/uploads/"+ req.user.username + "/" + downloadFile.file;
            res.download(path);
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

//POST: /files/edit => update the db for the selected file
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