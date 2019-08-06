const router = require('express').Router();
const db = require('../data/db');

router.post('/', (req, res) => {
    const postInfo = req.body;
    if (postInfo.title && postInfo.contents){
        db.insert(postInfo)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                res.status(500).json({error: 'There was an error while saving the post to the database.'});
            });
        
    }
    else {
        res.status(400).json({errorMessage: 'Please provide title and contents for this post.'});
 
    }
});

router.post('/:id/comments', (req, res) => {
    const commentInfo = req.body;
    const postId = req.params;
    console.log(commentInfo)
    console.log(postId)
    
    if (commentInfo.text && (commentInfo.post_id === postId.id)){
        db.findById(postId)
        .then(post => {
            if(post){
                db.insertComment(commentInfo)
                .then(id => {
                    res.status(201).json(id);
                })
                .catch(err => {
                    res.status(500).json({error: "There was an error saving the comment to the database."});
                });
            }
            else {
                res.status(404).json({message: "The post with the specified ID does not exist."});
            }
        })
        .catch(err => {
            res.status(500).json({error: "There was an error saving the comment to the database."});

        })
        
    }else {
        res.status(400).json({errorMessage: 'Please provide text for the comment.'});
    }
});


router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({error: "The posts information could not be retrieved."});
        });
});




module.exports = router;
