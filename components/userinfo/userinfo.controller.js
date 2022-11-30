const users = require('../../models/users');
const userinfos = require('../../models/userinfos');
exports.getAll = async(req, res) =>  {
    try {
        const allusers = await users.find();
        res.status(200).json(allusers);
    } catch (error) {
        res.status(500).json(error);
    }
};
exports.getOneByID = async(req, res) =>  {
    try {
        const user = await users.findOne({_id: req.params.id});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.getOneInfoById = async(req, res) =>  {
    try {
        const user = await users.findOne({_id: req.params.id});
        const userinfo = await userinfos.findOne({email: user.email});
        res.status(200).json(userinfo);
    } catch (error) {
        res.status(500).json(error);
    }
};