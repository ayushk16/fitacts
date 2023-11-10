const setUserToken = ({ user, token }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
}

const getToken = () => {
    return localStorage.getItem('token')
}

const getUser = () => {
    return JSON.parse(localStorage.getItem('user'))
}

const removeUserToken = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
}

export { setUserToken, getToken, getUser, removeUserToken };