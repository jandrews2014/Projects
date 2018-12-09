$(function() {

  // Setup
  var $list, $newIForm, $newIButton;
  var item = '';                                 // item is an empty string
  $list = $('ul');                               // Cache the unordered list
  $newIForm = $('#newIForm');              // Cache form to add new items
  $newIButton = $('#newIButton');          // Cache button to show form

  $('li').hide().each(function(index) {          // Hide list items
    $(this).delay(450 * index).fadeIn(1600);     // Then fade them in
  });

  // Item counter
  function updateCount() {                       // Create function to update counter
    var items = $('li[class!=complete]').length; // Number of items in list
    $('#counter').text(items);                   // Added into counter circle
  }
  updateCount();                                 // Call the function

  // Setup for new item
  $newIButton.show();                         // Show the button
  $newIForm.hide();                           // Hide the form
  $('#showForm').on('click', function() {        // When click on add item button
    $newIButton.hide();                       // Hide the button
    $newIForm.show();                         // Show the form
  });

  // Add new item
  $newIForm.on('submit', function(e) {       // When a new item is submitted
    e.preventDefault();                         // Prevent form being submitted
    var text = $('input:text').val();           // Get value of text input
    $list.append('<li>' + text + '</li>');      // Add item to end of the list
    $('input:text').val('');                    // Empty the text input
    updateCount();                              // Update the count
  });

  // Click handling
  $list.on('click', 'li', function() {
    var $this = $(this);               // Cache the element in a jQuery object
    var complete = $this.hasClass('complete');  // Is item complete

    if (complete === true) {           // Check if item is complete
      $this.animate({                  // If so, animate opacity + padding
        opacity: 0.0,
        paddingLeft: '+=180'
      }, 500, 'swing', function() {    // Use callback when animation completes
        $this.remove();                // Then completely remove this item
      });
    } else {                           // Otherwise indicate it is complete
      item = $this.text();             // Get the text from the list item
      $this.remove();                  // Remove the list item
      $list                            // Add back to end of list as complete
        .append('<li class=\"complete\">' + item + '</li>')
        .hide().fadeIn(300);           // Hide it so it can be faded in
      updateCount();                   // Update the counter
    }                                  // End of else option
  });                                  // End of event handler

});