const Thing = require("../models/Thing");
const ratingSchema = require("../models/Ratings");
const fs = require("fs");
//projet fini

async function createThing(req, res, next) {
  console.log(req.body);
  const thingObject = JSON.parse(req.body.book);
  delete thingObject._id;
  delete thingObject._userId;
  const thing = new Thing({
    ...thingObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  thing
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
}

async function getOneThing(req, res, next) {
  Thing.findOne({
    _id: req.params.id,
  })
    .then((thing) => {
      if (!thing) {
        return res.status(404).json({
          error: "Thing not found",
        });
      }
      res.status(200).json(thing);
    })
    .catch((error) => {
      res.status(500).json({
        error: "Server error",
      });
    });
  console.log(req.params.id);
}

async function modifyThing(req, res, next) {
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete thingObject._userId;
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized for create" });
      } else {
        Thing.updateOne(
          { _id: req.params.id },
          { ...thingObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) =>
            res.status(401).json({
              error: "authentification échoué pour l'ajout de cet élément",
            })
          );
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
}

async function deleteThing(req, res, next) {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = thing.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Thing.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "authentification échoué pour supprimer" });
    });
}

async function getAllStuff(req, res, next) {
  Thing.find()
    .then((things) => {
      res.status(200).json(things);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
}

//ajout des notes
async function addRating(req, res, next) {
  const userId = req.auth.userId;
  const bookId = req.params.id;
  const grade = req.body.rating;

  console.log("UserID:", userId);
  console.log("BookID:", bookId);
  console.log("Grade:", grade);

  if (grade < 1 || grade > 5) {
    return res
      .status(400)
      .json({ error: "La notation doit être comprise entre 1 et 5." });
  }
  const thing = await Thing.findOne({ _id: bookId });
  if (!thing) {
    return res.status(404).json({ error: "Livre non trouvé." });
  }
  /*Thing.findOne({ _id: bookId })
    .then((thing) => {
      if (!thing) {
        return res.status(404).json({ error: "Livre non trouvé." });
      }*/

  const existingRating = thing.ratings.find(
    (rating) => rating.userId === userId
  );

  if (existingRating) {
    existingRating.grade = grade;
  } else {
    thing.ratings.push({ userId, grade });
  }
  const totalRatings = thing.ratings.reduce(
    (sum, rating) => sum + rating.grade,
    0
  );
  const averageRating = totalRatings / thing.ratings.length;
  thing.averageRating = averageRating.toFixed(2);
  const updatingBook = await thing.save();
  return res.status(201).json(updatingBook);
  /*})
    .catch((error) => {
      res.status(500).json({ error: "Erreur" });
    });*/
}

async function getBestRatedBooks(req, res, next) {
  try {
    const bestRatedBooks = await Thing.find()
      .sort({ averageRating: -1 })
      .limit(3);

    // Ajoutez des logs pour vérifier les étapes intermédiaires
    console.log("Best Rated Books:", bestRatedBooks);

    res.status(200).json(bestRatedBooks);
  } catch (error) {
    console.error("Error in getBestRatedBooks:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des livres les mieux notés.",
    });
  }
}

module.exports = {
  createThing,
  getOneThing,
  modifyThing,
  deleteThing,
  getAllStuff,
  addRating,
  getBestRatedBooks,
};
