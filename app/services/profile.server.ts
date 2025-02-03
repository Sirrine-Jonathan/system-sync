import { google } from 'googleapis'

const getService = async ({
    accessToken,
    refreshToken,
}: {
    accessToken: string
    refreshToken: string | null
}) => {
    if (!accessToken) throw new Error('User not authenticated')

    // Set up the OAuth2 client with access token
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    })

    // Initialize Google Profile API client
    return google.oauth2({ version: 'v2', auth: oauth2Client })
}

export const getProfile = async ({
    accessToken,
    refreshToken,
}: {
    accessToken: string
    refreshToken: string | null
}) => {
    const googleService = await getService({ accessToken, refreshToken })

    const response = await googleService.userinfo.get()

    return response.data
}
