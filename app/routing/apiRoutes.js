// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information (friend data array)
// ===============================================================================
var friendsData = require("../data/friends");

var scoresFromExistArr;
var differencesArr = [];
var bestMatch;

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  
  //shows all the friends in the array 
  app.get("/api/friends", function(req, res) {

    res.json(friendsData);

  });

  //post request from the survey.html activated on.click
  app.post("/api/friends", function(req, res) {
    
      var userData = req.body;
      
      //function that will turn user's scores into integers
      function returnInt(element) {
        return parseInt(element, 10);
      };

      //.map function goes through array of user's scores and turns them into integers using returnInt function
      var userScores = userData.scores.map(returnInt);
      
      //for loop used to get scores from existing array of potential friends
      for(var i = 0; i < friendsData.length; i++){

        //existing friends' score data is turned into integers through corresponding index on array
        scoresFromExistArr = friendsData[i].scores.map(returnInt);
        
        //.map function loops through array of existing friend scores and subtracts it from user's scores
        var result = scoresFromExistArr.map(function (num, idx) {
            return Math.abs(num - userScores[idx]);
          });
        
       
        // 'add' function declared to help add the differences
        function add (num1, num2) {
            return num1 + num2;
        };

        // .reduce is used to add the array of differences
        var sum = result.reduce(add);
          console.log("sum: " + sum);

        // the sums of differences are pushed into 'differencesArr'
        differencesArr.push(sum);
          console.log("Difference Sums in array: " + differencesArr)

      }; //end of for loop

    //uses Math.min to find smallest difference in array then finds the index of that number in the differencesArr
    bestMatchIndex = differencesArr.indexOf(Math.min(...differencesArr));
      console.log('Best Match Index: ' + bestMatchIndex);

    //since the index of the differences corresponds to the index in the existing friends array, the object of the matching index is returned to the survey.html page 
    res.json(friendsData[bestMatchIndex]);

    //the differencesArr is emptied to start new for the next survey
    differencesArr = [];

    //the current user's data is pushed into the existing friends array
    friendsData.push(userData);
  
  });


};//end of module.exports
