import * as SecureStore from "expo-secure-store";

export const saveTokens = async (access_token: string, refresh_token: string, userId: string) => {
    await SecureStore.setItemAsync("access_token", access_token);
    console.log("Stored ACcess Token", access_token);
    await SecureStore.setItemAsync("refresh_token", refresh_token);
    console.log("Stored refresh Token", refresh_token);
    await SecureStore.setItemAsync("user_id", userId);
    console.log("User Id", userId);
};

export const getTokens = async () => {
    const access_token = await SecureStore.getItemAsync("access_token");
    const refresh_token = await SecureStore.getItemAsync("refresh_token");
    const user_id = await SecureStore.getItemAsync("user_id");

    if (!access_token || !refresh_token || !user_id) return null;
    return {access_token, refresh_token, user_id};
};

export const getUserId = async () => {
    return await SecureStore.getItemAsync("user_id");
}

export const removeTokens = async () => {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
    await SecureStore.deleteItemAsync("user_id");
};
