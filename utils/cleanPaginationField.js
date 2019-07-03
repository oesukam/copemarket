function cleanFields (data = {}) {
  return {
    limit: data.limit || 0,
    page: data.page || 0,
    pages: data.pages || 0,
    total: data.total || 0,
    data: data.docs || []
  }
}

module.exports = cleanFields
