var Joi = require('joi');
var Auth = require('./auth');

exports.register = function(server,options,next){
  server.route([

    {
      method: 'GET', // gets all messages
      path: '/messages',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
          db.collection('messages').find().toArray(function(err, messages) {
            if (err) {
              return reply('Internal MongoDB error', err);
            }

            reply(messages);
          });
      }
    },

    {
      // Creating a new message
      method: 'POST',
      path: '/messages',
      config: { 
        handler: function(request, reply) {
          Auth.authenticated(request, function(result) {
            if (result.authenticated) {
              // If the user is logged in it is authenticated so create the new post
              var db       = request.server.plugins['hapi-mongodb'].db;
              var session  = request.session.get('Whiskey-Lovers_session');
              var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
              var message = { 
                "message": request.payload.message.message,
                "user_id": ObjectId(session.user_id)
              };
              db.collection('messages').insert(message, function(err, writeResult) {
                if (err) { 
                  return reply('Internal MongoDB error', err); 
                } else {
                  reply({ "message": "Not signed in" });
                }
              });
              validate: {
                payload: {
                  tweet: {
                // Limit to 120 chars (market research told me 100 but i made it 120)
                    message: Joi.string().max(120).required()
                  }
                }
              }
            }
          })
        }
      }  
    },

    {
      // Retrieve a post
      method: 'GET',
      path: '/messages/{id}',
      handler: function(request, reply) {
        var message_id = encodeURIComponent(request.params.id);

        var db = request.server.plugins['hapi-mongodb'].db;
        var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

        db.collection('messages').findOne({ "_id": ObjectId(message_id)}, function(err, message) {
          if (err) { return reply('Internal MongoDB error', err); }

          reply(message);
        })
      }
    },

    /*{
      //Delete a message
      method: 'DELETE',
      path: '/messages/{id}',
      handler: function(request, reply) {
        Auth.authenticated(request, function(result) {
          if (result.authenticated) {
            var message_id = encodeURIComponent(request.params.id);

            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

            db.collection('messages').remove({ "_id": ObjectId(tweet_id) }, function(err, writeResult) {
              if (err) { return reply('Internal MongoDB error', err); }

              reply(writeResult);
            });
          } else {
            reply(result.message);
          }
        });
      }
    },*/

     {
      // Retrieve all messages by a specific user
      method: 'GET',
      path: '/users/{username}/messages',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        var username = encodeURIComponent(request.params.username);

        db.collection('users').findOne({ "username": username }, function(err, user) {
          if (err) { return reply('Internal MongoDB error', err); }

          db.collection('messages').find({ "user_id": user._id }).toArray(function(err, messages) {
            if (err) { return reply('Internal MongoDB error', err); }

            reply(messages);
          })
        })
      }
    }

  ]);

  next();
};

exports.register.attributes = {
  name: 'messages-routes',
  version: '0.0.1'
};