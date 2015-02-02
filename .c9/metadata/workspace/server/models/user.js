{"filter":false,"title":"user.js","tooltip":"/server/models/user.js","undoManager":{"mark":2,"position":2,"stack":[[{"group":"doc","deltas":[{"start":{"row":148,"column":82},"end":{"row":148,"column":96},"action":"insert","lines":["where \"id\"<>$3"]},{"start":{"row":159,"column":63},"end":{"row":159,"column":64},"action":"remove","lines":["'"]},{"start":{"row":159,"column":63},"end":{"row":159,"column":94},"action":"insert","lines":["where \"id\"<>$1',[loggedUser.id]"]},{"start":{"row":165,"column":50},"end":{"row":165,"column":65},"action":"insert","lines":[", loggedUser.id"]},{"start":{"row":171,"column":11},"end":{"row":174,"column":35},"action":"remove","lines":["//usersList.data = new Array();","        \t  //usersList.data.push(arrUsrs);","        \t  usersList.data = arrUsrs;","        \t  //console.log(usersList)"]},{"start":{"row":171,"column":11},"end":{"row":171,"column":35},"action":"insert","lines":["usersList.data = arrUsrs"]},{"start":{"row":180,"column":50},"end":{"row":180,"column":65},"action":"insert","lines":[", loggedUser.id"]},{"start":{"row":186,"column":0},"end":{"row":188,"column":0},"action":"remove","lines":["        \t  //usersList.data = new Array();","        \t  //usersList.data.push(arrUsrs);",""]},{"start":{"row":188,"column":0},"end":{"row":189,"column":0},"action":"remove","lines":["        \t  //console.log(usersList);",""]},{"start":{"row":191,"column":4},"end":{"row":221,"column":9},"action":"insert","lines":["}      ","    });","  },","  ","  /****************************************************************************","  * getFriends list","  *","  * Result:","      (array)(array) - Массив с пользователями","  */","  getFriends: function(callback) {","    ","    var usersList = { data: [{}] };","    ","    pg.connect(database.url_pg, function(err, client, done) {","      if(err){console.log(err); return usersList}","      ","      var querySelect = 'SELECT \"Users\".id, \"Users\".username, \"Users\".email, \"Users\".\"visibleProfile\", \"UserFriends\".\"Status\" \\","                        FROM public.\"UserFriends\" left join public.\"Users\" on \"Users\".id = \"UserFriends\".\"FriendId\" \\","                        WHERE \"UserFriends\".\"UserId\" = $1';","      ","      //получаем список","      client.query(querySelect,[loggedUser.id], function(err, result){","    \t  if(err) {callback(errors.restStat_DbReadError, err, usersList); return usersList}","    \t  ","    \t  var arrUsrs = result.rows.map(function(object) { ","        \t    return { id: object.id, username: object.username, email: object.email, img:'avtr' + object.id + '.png', status:object.Status };","        \t  });","        \t  usersList.data = arrUsrs;","        \t  done();","        \t"]},{"start":{"row":221,"column":11},"end":{"row":221,"column":13},"action":"remove","lines":["//"]},{"start":{"row":222,"column":0},"end":{"row":223,"column":2},"action":"insert","lines":["        \t  return usersList;","  "]},{"start":{"row":223,"column":7},"end":{"row":224,"column":0},"action":"insert","lines":[");",""]},{"start":{"row":224,"column":4},"end":{"row":224,"column":6},"action":"remove","lines":["  "]},{"start":{"row":224,"column":4},"end":{"row":225,"column":4},"action":"insert","lines":["});","  },"]},{"start":{"row":226,"column":2},"end":{"row":227,"column":0},"action":"insert","lines":["",""]},{"start":{"row":227,"column":2},"end":{"row":228,"column":4},"action":"remove","lines":["});","  },"]},{"start":{"row":227,"column":2},"end":{"row":257,"column":2},"action":"insert","lines":["/*","  * addFriend","  * Добавляет пользователя в список друзей со статусом \"заявка\"","  * По идеи, нужно когда другой пользователь подтверждает, здесь же организовать эту логику","  * id - id пользователя которого хотят добавить","  * Result:","  * (boolean)","  */","  addFriend: function(friendId){","    ","    pg.connect(database.url_pg, function(err, client, done) {","      if(err){console.log(err); return false}","      ","      var queryInsert = 'INSERT INTO \"UserFriends\"(\"UserId\", \"FriendId\", \"Status\") VALUES ($1, $2, $3);';","      ","      //добавляем друга","      client.query('BEGIN', function(err){","    \t  if(err) {rollback(client, done); return false}","    \t        ","    \t  client.query(queryInsert, [loggedUser.id, friendId, 0], function(err, result) {","      \t  if(err) { console.log(err); rollback(client, done); return false }","      \t  ","      \t  client.query('COMMIT');","          done();","          return true;","    \t  });","      });","    });","    ","  },","  "]}]}],[{"group":"doc","deltas":[{"start":{"row":235,"column":30},"end":{"row":235,"column":40},"action":"insert","lines":[", callback"]},{"start":{"row":238,"column":32},"end":{"row":238,"column":39},"action":"remove","lines":["return "]},{"start":{"row":238,"column":32},"end":{"row":238,"column":41},"action":"insert","lines":["callback("]},{"start":{"row":238,"column":46},"end":{"row":238,"column":47},"action":"insert","lines":[")"]},{"start":{"row":244,"column":40},"end":{"row":244,"column":47},"action":"remove","lines":["return "]},{"start":{"row":244,"column":40},"end":{"row":244,"column":49},"action":"insert","lines":["callback("]},{"start":{"row":244,"column":54},"end":{"row":244,"column":55},"action":"insert","lines":[")"]},{"start":{"row":247,"column":61},"end":{"row":247,"column":73},"action":"remove","lines":["return false"]},{"start":{"row":247,"column":61},"end":{"row":273,"column":76},"action":"insert","lines":["callback(false) }","      \t  ","      \t  client.query('COMMIT');","          done();","          callback(true);","    \t  });","      });","    });","    ","  },","  /*","  * deleteFriend","  *","  */","  deleteFriend: function(friendId, callback){","    ","    pg.connect(database.url_pg, function(err, client, done) {","      if(err){console.log(err); callback(false)}","      ","      var queryDelete = 'DELETE FROM \"UserFriends\" WHERE FriendId=$1 and UserId=$2;';","      ","      //добавляем друга","      client.query('BEGIN', function(err){","    \t  if(err) {rollback(client, done); callback(false)}","    \t        ","    \t  client.query(queryDelete, [friendId, loggedUser.id], function(err, result) {","      \t  if(err) { console.log(err); rollback(client, done); callback(false)"]},{"start":{"row":277,"column":10},"end":{"row":277,"column":17},"action":"remove","lines":["return "]},{"start":{"row":277,"column":10},"end":{"row":277,"column":19},"action":"insert","lines":["callback("]},{"start":{"row":277,"column":23},"end":{"row":277,"column":24},"action":"insert","lines":[")"]},{"start":{"row":282,"column":0},"end":{"row":283,"column":0},"action":"insert","lines":["    ",""]}]}],[{"group":"doc","deltas":[{"start":{"row":201,"column":23},"end":{"row":201,"column":31},"action":"insert","lines":["UserId, "]},{"start":{"row":213,"column":32},"end":{"row":213,"column":38},"action":"remove","lines":["logged"]},{"start":{"row":213,"column":32},"end":{"row":213,"column":39},"action":"insert","lines":["Number("]},{"start":{"row":213,"column":43},"end":{"row":213,"column":46},"action":"remove","lines":[".id"]},{"start":{"row":213,"column":43},"end":{"row":213,"column":46},"action":"insert","lines":["Id)"]},{"start":{"row":266,"column":57},"end":{"row":266,"column":58},"action":"insert","lines":["\""]},{"start":{"row":266,"column":66},"end":{"row":266,"column":67},"action":"insert","lines":["\""]},{"start":{"row":266,"column":75},"end":{"row":266,"column":76},"action":"insert","lines":["\""]},{"start":{"row":266,"column":82},"end":{"row":266,"column":83},"action":"insert","lines":["\""]}]}]]},"ace":{"folds":[],"customSyntax":"javascript","scrolltop":352,"scrollleft":0,"selection":{"start":{"row":273,"column":9},"end":{"row":273,"column":9},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":443,"mode":"ace/mode/javascript"}},"hash":"a39b1a54230af99dcd24fb18ef69774077c1f3ae"}