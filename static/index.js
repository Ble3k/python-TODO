$(document).ready(function () {
  var table = $('.table'),
      input = $('.input'),
      priorityInput = $('.input-priority'),
      descriptionInput = $('.input-description'),
      nameInput = $('.input-name'),
      submitBtn = $('.submit'),
      validate = $('.validate')

  var endpoint = '/tasks'

  var callApi = function (method, endpoint, data, onSuccess, onError) {
    $.ajax({
      type: method,
      url: endpoint,
      data,
      success: onSuccess,
      error: onError,
    });
  }

  var renderRows = function (rows) {
    var tableBody = $('<tbody></tbody>')

    rows
      .sort(function (a, b) { return b.priority - a.priority })
      .forEach(function (item) {
        tableBody.append($(
          '<tr class="row-tr">' +
            '<td>' + item.name + '</td>' +
            '<td>' + item.description + '</td>' +
            '<td>' + item.priority + '</td>' +
          '</tr>'
        ))
      })

    table.children('tbody').replaceWith(tableBody)
    input.val(undefined)
  }

  var errorCb = function (error) { console.warn(error, 'oops, request fail') }

  priorityInput.on('keydown', function (e) {
    if ((e.keyCode <= 47 || e.keyCode >= 58) && e.keyCode !== 8 ) {
      e.preventDefault()
    }
  })

  submitBtn.on('click', function () {
    if (nameInput.val().length && descriptionInput.val().length && priorityInput.val().length) {
      callApi(
        'POST',
        endpoint,
        JSON.stringify({
          name: nameInput.val(),
          description: descriptionInput.val(),
          priority: priorityInput.val()
        }),
        renderRows,
        errorCb,
      )
    } else {
      validate.html('Every field is required!')
      input.each(function (key, elem) {
        if (!$(elem).val().length) $(elem).addClass('error')
      })
    }
  })

  input.on('focus', function () {
    validate.html('')
    input.removeClass('error')
  })

  callApi('GET', endpoint, {}, renderRows, errorCb)

})
