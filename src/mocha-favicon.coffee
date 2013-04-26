root = exports ? @

root.MochaFavicon = (runner) ->
  url = (u) -> u
  icons = 
    fail: url('.tmp/favicons/fail.png')
    pass: url('.tmp/favicons/pass.png')
    pending: url('.tmp/favicons/pending.png')

  title = 'Running'
  
  favicon.change icons.pending, title
  count = 0
  runner.on 'test end', ->
    count += 1
    document.title = "#{ title } [#{ count }]"

  runner.on 'fail', ->
    Tinycon.setBubble(runner.failures, 'red')
    title = 'Failing'
  
  runner.on 'end', ->
    if runner.failures
      favicon.change icons.fail, "Fail #{runner.failures}/#{runner.total}"
    else
      favicon.change icons.pass, "Pass #{runner.total}"
