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

router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(post => {
            if(post.length > 0) {
                res.status(200).json(post);
            }
            else {
                res.status(404).json({ message: "The post with the specified id does not exist."})
 
            }
        })
        .catch(err => {
            res.status(500).json({error: "The post information could not be retrieved."});

        });       
});

router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(post => {
            if(post){
                db.findPostComments(id)
                    .then(comments => {
                        
                        if (comments.length > 0){
                            res.status(200).json(comments);
                        }
                        else {
                            res.status(404).json({message: "The post with the specified ID does not exist"})
                        }
                    })
                    .catch(err => {
                        res.status(500).json({error: "The comments information could not be retrieved."})
                    });
            }
            else {
                res.status(404).json({message: "The post with the specified id does not exist"})
            }

        })
        .catch(err => {
            res.status(500).json({error: "The post information could not be retrieved."})
        });

});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(post => {
            console.log(post)
            if(post.length > 0){
                db.remove(id)
                    .then(removed => {
                        res.status(200).json(removed);
                    })
                    .catch(err => {
                        res.status(500).json({error: "Post could not be removed."})
                    });
            }
            else {
                res.status(404).json({message: "The post with the specified ID does not exist."})
            }
        })
        .catch(err => {
            res.status(500).json({error: "The post could not be found."})
        });
})

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    db.findById(id)
        .then(post => {
            if(post.length > 0){
                console.log(changes.title, changes.contents)
                if(changes.title && changes.contents){
                    db.update(id, changes)
                        .then(updated => {
                            console.log(id);
                            db.findById(id)
                                .then(updatedPost => {
                                    
                                    res.status(200).json(updatedPost)

                                })
                                .catch (err => {
                                    res.status(500).json({message: "error modifying data"})
                                })
                        })
                        .catch(err => {
                            res.status(500).json({error: "The post information could not be modified."});
                        })


                }
                else {
                    res.status(400).json({errorMessage: "Please provide title and contents for the post"});
                }

            }
            else {
                res.status(404).json({message: "The post with that ID does not exist."});
            }
        })
        .catch(err => {
            res.status(500).json({error: "The post information could not be modified."});
        })
})



module.exports = router;
