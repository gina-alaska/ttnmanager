# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).on 'ready page:load', ->
  $("input[type='checkbox']").bootstrapSwitch
    onText: 'Yes'
    offText: 'No'

  $("input[type='radio']").bootstrapSwitch
    onText: 'Yes'
    offText: 'No'
    radioAllOff: true
