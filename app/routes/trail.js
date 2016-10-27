import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
     return this.store.findRecord('climb', params.climb_id);

   },
   actions: {
     update(climb, params) {
       Object.keys(params).forEach(function(key) {
         if(params[key]!==undefined) {
           climb.set(key,params[key]);
         }
       });
     climb.save();
     this.transitionTo("trail");
   },
   destroyClimb(climb) {
     climb.destroyRecord();
     this.transitionTo('index');
   },
   destroyTrail(trail) {
  var comment_deletions = trail.get('comments').map(function(comment) {
    return comment.destroyRecord();
  });
  Ember.RSVP.all(comment_deletions).then(function() {
    return trail.destroyRecord();
  });
      this.transitionTo('index');
    },
    saveComment(params) {
      var newComment = this.store.createRecord('comment', params);
      var climb = params.climb;
      console.log(climb)
      climb.get('comment').addObject(newComment);
      newComment.save().then(function(){
        return climb.save();
      });
    }
   }
 });
