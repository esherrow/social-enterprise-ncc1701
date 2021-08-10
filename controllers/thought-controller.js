const { Thought, User} = require('../models');

const thoughtController = {
    getAllThoughts(req, res){
        Thought.find({})
            .then(dbThoughts => res.json(dbThoughts))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    getOneThought({params}, res){
        Thought.findOne({_id: params.id})
            .then(dbThoughts => {
                if(!dbThoughts){
                    res.status(404).json({message: 'No Thought found with that id!'});
                    return;
                }
                res.json(dbThoughts);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    
    addThought({params, body}, res){
        console.log(body);
        Thought.create(body)
            .then(({_id})=>{
                return User.findOneAndUpdate(
                    {_id: params.userId},
                    {$push: {thoughts:_id}},
                    {new: true}
                );
            })
            .then(dbUserData => {
                if(!dbUserData){
                    res.status(404).json({ message: 'No User found with this id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    updateThought(){
        Thought.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .then(({_id})=>{
            return User.findOneAndUpdate(
                {_id: params.userId},
                {$push: {thoughts:_id}},
                {new: true}
            );
        })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({message: 'No User found with that id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    removeThought({params}, res){
        Thought.findOneAndDelete({_id: params.thoughtId})
        .then(deletedThought => {
            if(!deletedThought){
                return res.status(404).json({message:'No Thought with that id!'});
            }
            return User.findOneAndUpdate(
                {_id: params.userId},
                {$pull: {thoughts: params.thoughtId}},
                {new: true}
            );
        })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No User found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    addReaction({params, body}, res){
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$push: {reactions: body}},
            {new: true, runValidators: true}
        )
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No User found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    removeReaction({params}, res){
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$pull: {reactions: { reactionId: params.reactionId}}},
            {new:true}
        )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;