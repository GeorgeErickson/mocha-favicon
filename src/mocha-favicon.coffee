root = exports ? @

root.MochaFavicon = (runner) ->
  url = (u) -> u
  icons = 
    fail: url('.tmp/favicons/fail.png')
    pass: url('.tmp/favicons/pass.png')
    pending: url('.tmp/favicons/pending.png')
  
  favicon.change icons.pending, "Running"
  runner.on 'end', ->
    if runner.failures
      favicon.change icons.fail, "Fail #{runner.failures}"
    else
      favicon.change icons.pass, "Pass #{runner.total - runner.failures}"
