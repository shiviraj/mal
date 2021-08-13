const pr_str = (value) => {
  if (Array.isArray(value)) {
    return `(${value.map(pr_str).join(" ")})`
  }
  return value.toString()
}

module.exports = pr_str
