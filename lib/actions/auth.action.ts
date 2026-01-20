'use server';

import { db, auth } from "@/Firebase/admin";
import { messaging } from "firebase-admin";
import { success } from "zod";

export async function SignUp(params: SignUpParams){
    const { uid, name, email } = params;

    try{
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return{
                success: false,
                message: "User already exists"
            }
        }

        await db.collection('users').doc(uid).set({
            name,
            email,
        })
    }catch(e: any){
        console.error("Error signing up user", e);

        if(e.code === 'auth/email-already-exists'){
            return{
                success: false,
                message: "Email already exists"
            }
        }

        return{
            success: false,
            message: "Failed to create account"
        }
    }
}

export async function SignIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        await auth.verifyIdToken(idToken);

        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                message: "User does not exist"
            }
        }
        
        return {
            success: true,
            message: "Signed in successfully"
        }
    } catch (e) {
        console.error("Error signing in", e);
        return {
            success: false,
            message: "Failed to sign in"
        }
    }

}

export async function SyncUser(params: { uid: string; email: string; name: string }) {
    const { uid, email, name } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if (!userRecord.exists) {
            await db.collection('users').doc(uid).set({
                name,
                email,
                createdAt: new Date().toISOString(),
            });
        }

        return {
            success: true,
            message: "User synced successfully"
        }
    } catch (e) {
        console.error("Error syncing user", e);
        return {
            success: false,
            message: "Failed to sync user"
        }
    }
}
