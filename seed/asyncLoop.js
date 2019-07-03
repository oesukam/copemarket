module.exports.loop = (arr, fn, busy, err, i = 0) => {
  const body = (ok, er) => {
    try {
      const r = fn(arr[i], i, arr)
      r && r.then ? r.then(ok).catch(er) : ok(r)
    } catch (e) {
      er(e)
    }
  }
  const next = (ok, er) => () => loop(arr, fn, ok, er, ++i)
  const run = (ok, er) => (i < arr.length ? new Promise(body).then(next(ok, er)).catch(er) : ok())
  return busy ? run(busy, err) : new Promise(run)
}

module.exports.delay = (time = 300) => {
  return new Promise(resolve => setTimeout(resolve, time))
}

module.exports.delayLog = async (item) => {
  await delay()
}
