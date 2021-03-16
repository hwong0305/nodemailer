fetch('/api/mapping')
  .then((r) => r.json())
  .then((data) => {
    console.log(data)
  })
