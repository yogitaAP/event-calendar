/*
 * This file contains the logic to find the positioning of events in a day of a calendar. 
 * Assumption: ID of an event is always a number.
 * 
 * Author: Yogita Sharma
 */

//Intialiasing global variables
var overlappingEvents = [];
overlappingEvents[0] = [];
var allowedWidth = 600;
var inlineBorderWidth = 2;
var inputEvents = [{id : 123, start : 60, end : 150},
            {id : 234, start: 540, end: 570},
            {id: 456, start: 545, end: 600},
            {id: 576, start: 570, end: 660}
        ];

//Sorting events in ascendign order by start time
var events = inputEvents.sort(function(a,b) {return (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0);});         


var findEvent = function(id) {
    var i = events.length;
    while (i--) {
      if (events[i].id === id) {
        return events[i];
      }
    }
    return false;
};

      
var findOverLappingEvents = function(events) {
    overlappingEvents[0].push(events[0].id);

    for (var i = 1, l = events.length; i < l; ++i) {
      var event = events[i];

      var isOverLaps = false;

      var j = i - 1;
      do {
        var prevEvent = events[j];

        if (overlapsTo(event, prevEvent)) {

          var isAlreadyOverlapped = false;


          var k= overlappingEvents.length;
          while (!isAlreadyOverlapped && k--) {
            if (overlappingEvents[k].indexOf(prevEvent.id) !== -1) {
              overlappingEvents[k].push(event.id);
              isAlreadyOverlapped = true;
            }
          }

          isOverLaps = true;
        }
      } while (!isOverLaps && j--);

      if (!isOverLaps) {
        overlappingEvents.push([event.id]);
      }
    }

    return overlappingEvents;
};
    
var calculatePos = function(events) {
    for (var i = 0, l = events.length; i < l; ++i) {
      events[i].top = events[i].start * 2;
      events[i].height = (events[i].end - this.events[i].start) * 2;
    }

    for (var i = 0, l = overlappingEvents.length; i < l; ++i) {
      var collections = overlappingEvents[i];
      var table = [];

      table[0] = [];

      for (var j = 0, l2 = collections.length; j < l2; ++j) {

        var event = this.findEvent(collections[j]);
        var column = 0;
        var isExists = false;
        while(!isExists) {
          var row = getColumnLastRow(table, column);

          if (row === false) {
            table[0].push(event);
            isExists = true;
          } else {
            var existingevent = table[row][column];
            if (!overlapsTo(event, existingevent)) {
              if (table[row + 1] === undefined) {
                table[row + 1] = [];
              }
              table[row + 1][column] = event;
              isExists = true;
            }
          }

          column++;
        }
      }


      var maxRowLength = 1;
      for (var j = 0, l2 = table.length; j < l2; ++j) {
        maxRowLength = Math.max(maxRowLength, table[j].length);
      }
      var eventWidth = (allowedWidth / maxRowLength);

      var eventLeftPositions = [];
      for (var j = 0, l2 = maxRowLength; j < l2; ++j) {
        eventLeftPositions[j] = (eventWidth * j);
      }

      for (var row = 0, l2 = table.length; row < l2; ++row) {
        for (var column = 0, l3 = table[row].length; column < l3; ++column) {
          var event = table[row][column];
          event.left = eventLeftPositions[column];
          event.width = eventWidth;
        }
      }
    }
  };

    

var getColumnLastRow = function(table, col) {
  var row = table.length;
  while (row--) {
    if (table[row][col] !== undefined) return row;
  }

  return false;
};


var overlapsTo = function(eventA, eventB) {
  if ( (eventA.start <= eventB.start && eventB.start <= eventA.end) ||
       (eventA.start <= eventB.end && eventB.end <= eventA.end) ||
       (eventB.start <= eventA.start && eventA.start <= eventB.end) ||
       (eventB.start <= eventA.end && eventA.end <= eventB.end) ) {
    return true;
  }
  return false;
};
    
    
var initLayout = function(events) {
    findOverLappingEvents(events);
    calculatePos(events);
};

initLayout(events);

//Dynamically creates DOM elements for events and set their CSS
var createEventEle = function(event, css) {
    var ele = $('<div class="events"><span></span></div>');
    $('#wrapper').append(ele);
    ele.css(css);
    ele.find('span').text('Event ' + event.id);
};

//To render the event elements on DOM

for(var i = 0; i < events.length; ++i) {
    var event = events[i];
    var css = {top: event.top + 'px', width: event.width + 'px', left: event.left + 'px', height: event.height + 'px'};
    createEventEle(event, css);
}
