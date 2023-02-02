export const getPath = (adrress) => {

  return "images/"+adrress.split('%2F')[1].split('?')[0]
}

export const getSearchURL = (value) => {

  return 'http://localhost:3000/search/'+value.split(' ').join('+')
}