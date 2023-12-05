import {authActions} from "../modules/auth/store/auth.slice";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";


export const ButtonGoogleSignIn = () => {
    const dispatch = useDispatch()

    function handleCallbackResponse(response: { credential: String }) {
        dispatch(authActions.userLoginGoogleAsync(response.credential))
    }

    useEffect(()=>{
        // @ts-ignore
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_CLIENT_ID,
            callback: handleCallbackResponse
        })

        // @ts-ignore
        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {theme: "filled_blue", size: "large", width: "291", }
        )
    }, [])

    return (
        <div id="signInDiv"></div>
    )
}
