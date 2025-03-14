export {}

/**
 * @typedef {Object} AuthContextType
 * @property {Error} [error]
 * @property {(error:Error)=>void} setError
 * @property {UserDataResponse} [user]
 * @property {(user?:UserDataResponse)=>void} setUser
 * @property {boolean} isLoading
 * @property {(state:boolean)=>void} setIsLoading
 * @property {boolean} isLoggedIn
 */
/**
 * @typedef {Object} SignInRequest
 * @property {string} username
 * @property {string} password
 */
/**
 * @typedef {Object} SignUpRequest
 * @property {string} username
 * @property {string} password
 */
/**
 * @typedef {Object} UserDataResponse
 * @property {number} id
 * @property {string} username
 * @property {string} email
 */
