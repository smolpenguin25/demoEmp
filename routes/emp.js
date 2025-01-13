var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const EmpModel = require('../models/emp.model');

/* GET home page. */
router.get('/', async (req, res) => {
  try{
    const emps = await EmpModel.find();
    return res.render('emp/index', { emps });
  }catch(err){
    return res.render('error', { message: err.message });
  }
});

router.get('/create', (req, res) => {
  return res.render('emp/create');
});

router.post('/create', async (req, res) => {
  try{
    const emp = new EmpModel(req.body);
    await emp.save();
    return res.redirect('/emp');
  }catch(err){
    return res.render('error', { message: err.message });
  }
});

router.get('/login', (req, res) => {
  return res.render('emp/login');
});

//todo login post
router.post('/login', async (req, res) => {
  try{
    const emp = await EmpModel.findOne({ email: req.body.email, pwd: req.body.pwd });
    if(emp){
      if(emp.role === 'admin'){
        //req.session.admin = emp;
        return res.redirect('/emp');
      }
      //req.session.emp = emp;
      return res.redirect('/emp/details/' + emp._id);
    }
    return res.render('emp/login', { message: 'Invalid email or password' });
  }catch(err){
    return res.render('error', { message: err.message });
  }
});

router.get('/details/:id', async (req, res) => {
  try{
    const emp = await EmpModel.findById(req.params.id);
    return res.render('emp/details', { emp });
  }catch(err){
    return res.render('error', { message: err.message });
  }
});

router.get('/search', async (req, res) => {
  try{
    const { keyword } = req.query;
    //const keyword = req.query.keyword;
    const emps = await EmpModel.find({ $and: [{name: keyword}]}); //find filtered user
    return res.render('emp/index', { emps });
  }catch(err){
    return res.render('error', { message: err.message });
  }
});

module.exports = router;
