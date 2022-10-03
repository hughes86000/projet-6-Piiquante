const Sauce = require("../models/sauce");

const fs = require('fs');


exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    usersLiked: [],
    usersDisLiked: [],
    likes: 0,
    dislikes: 0
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...req.body }

  Sauce.updateOne({ _id : req.params.id}, {...sauceObject, _id: req.params.id})
  .then(res.status(200).json({ message : "Sauce modifiée"}))
  .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id : req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split("/images/")[1]
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({_id : req.params.id})
  .then(res.status(200).json({ message: "Sauce supprimée" }))
  .catch(error => res.status(400).json({ error }))
  
    })
  })
  .catch(error => res.status(500).json({ error }))
}

exports.likesDislikesSauce = (req, res, next) => {
  Sauce.findById(req.params.id)
    .then(sauce => {
        const newUsersLiked = sauce.usersLiked.filter(user => user != req.body.userId);
        const newUsersDisliked = sauce.usersDisliked.filter(user => user != req.body.userId);
        if (req.body.like == 1) {
            newUsersLiked.push(req.body.userId)
        } else if( req.body.like == -1 )  {
            newUsersDisliked.push(req.body.userId)
        };
        const sauceAmended = {
            usersLiked: newUsersLiked,
            usersDisliked: newUsersDisliked,
            likes: newUsersLiked.length,
            dislikes: newUsersDisliked.length
        };
        Sauce.updateOne({_id: req.params.id}, sauceAmended)
        .then(() => res.status(200).json({message: 'Merci pour votre retour !'}))
        .catch(error => res.status(404).json({error}))
    })
    .catch(error => res.status(500).json({error}) );
};