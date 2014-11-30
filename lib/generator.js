module.exports = {
  generate : function(req,res,next){
    if(req.body.status && req.body.status.status_code){
      req.db.collection("number_generators")
      .find({status_code : req.body.status.status_code}).toArray()
      .done(function(data){
        var ticket = data[0];
        if(ticket){
          if(req.body[ticket.field]){
            next();
          }
          else{
            req.body[ticket.field] = ticket.prefix + ticket.count + "-"+ ticket.suffix;
            req.ticket = ticket;
            next();
          }
        }
        else{
          next();
        }

      })
      .fail( function( err ) {
        next();
      });
    }
    else{
      next();
    }
  },
  update : function(req,cb){
    if(req.ticket){
      var ticket = req.ticket;
      delete ticket._id;
      ticket.count+=1;
      req.db.collection("number_generators")
      .update({status_code : ticket.status_code}, ticket, {safe: true})
      .done(function(data){
        cb(null,null);
      })
      .fail( function( err ) {
        console.log(err);
        cb(null,null);
      });
    }
    else{
      cb(null,null);
    }
  }
};
