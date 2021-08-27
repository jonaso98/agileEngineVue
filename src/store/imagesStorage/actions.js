/* eslint-disable prettier/prettier */
//we import Api from axios from boot path
import apiAgileEngine from "../../services/index";

//this is our first acction we are going to bring the token access
export function getTokenValid({ commit }, payload) {
// we are going to return a promise (Resolve or Reject) with the answer
    // eslint-disable-next-line no-async-promise-executor
    return new Promise((resolve, reject) => {    
        const formData = new FormData()
        formData.set('apiKey', payload.apiKey);
        let Datas =  {
            'apiKey': payload.apiKey
        }
        apiAgileEngine.postAuthToken(Datas)
        .then(response => {
            console.log("response here Data ", response.data)
            if (response.data) {
                //access token saved correctly
                commit('setUserDetails', JSON.stringify(response.data))
                //return the response
                resolve(response)
            }
        })
        .catch(error => {
            reject(error)
        })
    })  
}

// eslint-disable-next-line no-unused-vars
export function getImages ({ commit, state }, payload) {
    // we are going to return a promise (Resolve or Reject) with the answer
    //console.log(sessionStorage.getItem("userDetails"))
    
        // eslint-disable-next-line no-async-promise-executor
        return new Promise((resolve, reject) => {
            const tokenhere = JSON.parse(sessionStorage.getItem("userDetails"))        
            apiAgileEngine.getImages(tokenhere.token, payload)
             .then(response => {
                 commit('setImagesMutation', JSON.stringify(response.data))
                 console.log('respuesta images', response.data)
                 resolve(response.data)                        
             })
             .catch(error => {
                 reject(error)
             })
         })    
    
      
}

// eslint-disable-next-line no-unused-vars
export function getImagesID ({ commit, state }, payload) {
    // we are going to return a promise (Resolve or Reject) with the answer
    
    return new Promise((resolve, reject) => {
        const tokenhere = JSON.parse(sessionStorage.getItem("userDetails"))
        apiAgileEngine.getImagesID(tokenhere.token, payload)
        .then(response => {
            //commit('setImagesMutation',response.data)
            resolve(response.data)                        
        })
        .catch(error => {
            reject(error)
        })
    })  
}
