class window.MochaFavicon
  icons: {} #set by data_uri.js
  constructor: (@runner) ->
    @set_ico '/lib/pending.ico', "Running"
    @runner.on 'end', @tests_done

  set_ico: (url, text) =>
    if text
      document.title = text

    $('link[rel="shortcut icon"]').remove()
    $('head').append "<link type='image/x-icon' rel='shortcut icon' href='#{url}'>"

  tests_done: =>
    if @runner.failures
      @set_ico '/lib/fail.ico', "Fail"
    else
      @set_ico '/lib/pass.ico', "Pass"
